"""Supabase-backed storage for bot subscribers and sent-reminder bookkeeping.

Run the SQL in supabase_schema.sql once to create the tables.
"""

from supabase import Client, create_client

from config import DEFAULT_REMINDER_DAYS, SUPABASE_SERVICE_KEY, SUPABASE_URL

_client: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def add_subscriber(chat_id: int, username: str | None) -> None:
    _client.table("bot_subscribers").upsert(
        {
            "chat_id": chat_id,
            "username": username,
            "reminder_days": DEFAULT_REMINDER_DAYS,
        },
        on_conflict="chat_id",
        ignore_duplicates=True,
    ).execute()


def remove_subscriber(chat_id: int) -> None:
    _client.table("bot_subscribers").delete().eq("chat_id", chat_id).execute()


def set_reminder_days(chat_id: int, days: int) -> None:
    _client.table("bot_subscribers").update({"reminder_days": days}).eq("chat_id", chat_id).execute()


def get_subscriber(chat_id: int) -> dict | None:
    res = _client.table("bot_subscribers").select("*").eq("chat_id", chat_id).limit(1).execute()
    return res.data[0] if res.data else None


def list_subscribers() -> list[dict]:
    return _client.table("bot_subscribers").select("*").execute().data


def was_reminder_sent(chat_id: int, opportunity_id: str, kind: str) -> bool:
    res = (
        _client.table("bot_reminders_sent")
        .select("chat_id")
        .eq("chat_id", chat_id)
        .eq("opportunity_id", opportunity_id)
        .eq("kind", kind)
        .limit(1)
        .execute()
    )
    return bool(res.data)


def mark_reminder_sent(chat_id: int, opportunity_id: str, kind: str) -> None:
    _client.table("bot_reminders_sent").upsert(
        {"chat_id": chat_id, "opportunity_id": opportunity_id, "kind": kind},
        on_conflict="chat_id,opportunity_id,kind",
        ignore_duplicates=True,
    ).execute()
