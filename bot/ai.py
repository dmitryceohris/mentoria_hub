"""OpenAI-powered MentorLM assistant for the Telegram bot:
free-form Q&A grounded in Mentoria opportunities, plus AI-written deadline
announcements.
"""

import re
from datetime import date, datetime

from openai import OpenAI

from config import CHANNEL_URL, OPENAI_API_KEY, OPENAI_MODEL, SITE_URL
import retrieval

_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None


def _upcoming(opp: dict) -> bool:
    """True if the opportunity's deadline/event date is today or later."""
    if opp.get("isRecurring"):
        return True
    raw = opp.get("deadline") or opp.get("eventDate")
    if not raw:
        return False  # no concrete date -> don't offer a reminder
    try:
        return datetime.fromisoformat(raw[:10]).date() >= date.today()
    except ValueError:
        return False


def _clean_markdown(text: str) -> str:
    """The model sometimes emits Markdown; we send plain text (HTML parse mode).
    Strip ** bold and convert [label](url) links to 'label: url'."""
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\((https?://[^\)]+)\)", r"\1: \2", text)
    text = re.sub(r"(?m)^\s*#{1,6}\s*", "", text)  # drop markdown headings
    return text.strip()


def _opportunities_context(opps: list[dict]) -> str:
    blocks = []
    for o in opps:
        deadline = o.get("deadline") or o.get("eventDate") or "не указан"
        blocks.append(
            f"### {o.get('title')} ({o.get('category')}, дедлайн: {deadline})\n"
            f"{(o.get('description') or '')[:500]}\n"
            f"Источник: {o.get('applyUrl', '')}"
        )
    return "\n\n".join(blocks)


def answer_with_suggestion(question: str) -> tuple[str, dict | None]:
    """Answer a question and, if a concrete upcoming opportunity is relevant,
    return it so the bot can offer a reminder. Returns (text, opportunity|None)."""
    opps = retrieval.retrieve(question)
    suggestion = next((o for o in opps if _upcoming(o)), None)
    return _generate(question, opps), suggestion


def answer(question: str) -> str:
    """Answer a free-form student question as MentorLM."""
    return _generate(question, retrieval.retrieve(question))


def _generate(question: str, opps: list[dict]) -> str:
    if not _client:
        return "ИИ временно недоступен. Передайте админу код: NO_OPENAI_KEY"

    context = _opportunities_context(opps)
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
- Если не знаешь — честно скажи и предложи заглянуть на канал/сайт.
- ВАЖНО: пиши простым текстом. НЕ используй Markdown (никаких **, ##, [текст](ссылка)) и HTML-теги. Ссылки давай как обычный URL прямо в тексте."""

    resp = _client.chat.completions.create(
        model=OPENAI_MODEL,
        temperature=0.5,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": question},
        ],
    )
    return _clean_markdown(resp.choices[0].message.content)


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
