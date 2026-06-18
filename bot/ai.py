"""OpenAI-powered MentorLM assistant for the Telegram bot:
free-form Q&A grounded in Mentoria opportunities, plus AI-written deadline
announcements.
"""

from datetime import date

from openai import OpenAI

from config import CHANNEL_URL, OPENAI_API_KEY, OPENAI_MODEL, SITE_URL
import retrieval

_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None


def _opportunities_context(question: str) -> str:
    opps = retrieval.retrieve(question)
    blocks = []
    for o in opps:
        deadline = o.get("deadline") or o.get("eventDate") or "не указан"
        blocks.append(
            f"### {o.get('title')} ({o.get('category')}, дедлайн: {deadline})\n"
            f"{(o.get('description') or '')[:500]}\n"
            f"Источник: {o.get('applyUrl', '')}"
        )
    return "\n\n".join(blocks)


def answer(question: str) -> str:
    """Answer a free-form student question as MentorLM."""
    if not _client:
        return "ИИ временно недоступен. Передайте админу код: NO_OPENAI_KEY"

    context = _opportunities_context(question)
    system = f"""Ты — MentorLM, дружелюбный ассистент Mentoria Hub (сообщество: новости, олимпиады, конкурсы, гранты, стажировки) для школьников 8–12 классов.

Сегодня {date.today().isoformat()}.

Ссылки, которыми можешь делиться:
- Канал: {CHANNEL_URL}
- Сайт: {SITE_URL}

Актуальные возможности Mentoria (используй их в ответах, не выдумывай чужие):
{context}

Правила:
- Отвечай на языке пользователя (русский/английский/казахский), дружелюбно и по делу.
- Если вопрос про конкурсы/возможности — опирайся на список выше, давай ссылку «Источник».
- Не рекомендуй мероприятия с прошедшим дедлайном; если дедлайн прошёл — так и скажи.
- Если не знаешь — честно скажи и предложи заглянуть на канал/сайт."""

    resp = _client.chat.completions.create(
        model=OPENAI_MODEL,
        temperature=0.5,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": question},
        ],
    )
    return resp.choices[0].message.content.strip()


def announce(title: str, days_left: int | None, closed: bool = False) -> str:
    """Generate a short, unique reminder text for one opportunity.
    Falls back to a static phrase if AI is unavailable."""
    if not _client:
        if closed:
            return f"🔒 Регистрация на «{title}» закончилась."
        return f"⏰ До «{title}» осталось {days_left} дн. Успей зарегистрироваться!"

    if closed:
        prompt = f"Напиши короткое (1 предложение) дружелюбное уведомление на русском, что регистрация на «{title}» закончилась. Без хэштегов."
    else:
        prompt = (
            f"Напиши короткое (1–2 предложения) дружелюбное напоминание на русском: до мероприятия «{title}» "
            f"осталось {days_left} дн. Призови успеть зарегистрироваться. Можно 1 эмодзи. Без хэштегов."
        )

    try:
        resp = _client.chat.completions.create(
            model=OPENAI_MODEL,
            temperature=0.8,
            messages=[{"role": "user", "content": prompt}],
        )
        return resp.choices[0].message.content.strip()
    except Exception:
        if closed:
            return f"🔒 Регистрация на «{title}» закончилась."
        return f"⏰ До «{title}» осталось {days_left} дн. Успей зарегистрироваться!"
