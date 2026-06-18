"""Deadline reminder logic: reads opportunities, computes days-to-deadline,
and sends per-subscriber notifications ("3 days left" / "registration closed").
"""

import json
from datetime import date, datetime

import requests

from config import LOCAL_OPPORTUNITIES, OPPORTUNITIES_URL
import storage


def load_opportunities() -> list[dict]:
    if OPPORTUNITIES_URL:
        try:
            return requests.get(OPPORTUNITIES_URL, timeout=15).json()
        except Exception as e:
            print(f"Failed to fetch opportunities from URL: {e}")
            return []
    try:
        return json.loads(LOCAL_OPPORTUNITIES.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"Failed to read local opportunities: {e}")
        return []


def _parse_date(value: str | None) -> date | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value[:10]).date()
    except ValueError:
        return None


def deadline_of(opp: dict) -> date | None:
    return _parse_date(opp.get("deadline")) or _parse_date(opp.get("eventDate"))


async def run_reminders(bot) -> None:
    """Called on a schedule. Sends upcoming/closed notices to each subscriber."""
    opportunities = load_opportunities()
    subscribers = storage.list_subscribers()
    if not opportunities or not subscribers:
        return

    today = date.today()

    for opp in opportunities:
        dl = deadline_of(opp)
        if dl is None or opp.get("isRecurring"):
            continue

        days_left = (dl - today).days
        title = opp.get("title", "мероприятие")
        opp_id = opp.get("id", title)
        url = opp.get("applyUrl", "")

        for sub in subscribers:
            chat_id = sub["chat_id"]
            threshold = sub.get("reminder_days", 3)

            # "Closing soon" — fire once when within the user's window (but not past).
            if 0 <= days_left <= threshold:
                if not storage.was_reminder_sent(chat_id, opp_id, "upcoming"):
                    day_word = "день" if days_left == 1 else "дня" if 2 <= days_left <= 4 else "дней"
                    when = "сегодня" if days_left == 0 else f"через {days_left} {day_word}"
                    text = (
                        f"⏰ До <b>{title}</b> осталось {when}!\n"
                        f"Успей зарегистрироваться 👇"
                    )
                    if url:
                        text += f"\n{url}"
                    await _safe_send(bot, chat_id, text)
                    storage.mark_reminder_sent(chat_id, opp_id, "upcoming")

            # "Registration closed" — fire once the day the deadline passes.
            elif days_left < 0:
                if not storage.was_reminder_sent(chat_id, opp_id, "closed"):
                    await _safe_send(bot, chat_id, f"🔒 Регистрация на <b>{title}</b> закончилась.")
                    storage.mark_reminder_sent(chat_id, opp_id, "closed")


async def _safe_send(bot, chat_id: int, text: str) -> None:
    try:
        await bot.send_message(chat_id, text, disable_web_page_preview=True)
    except Exception as e:
        # User blocked the bot or chat is gone — drop them so we stop retrying.
        print(f"send to {chat_id} failed: {e}")
        if "bot was blocked" in str(e).lower() or "chat not found" in str(e).lower():
            storage.remove_subscriber(chat_id)
