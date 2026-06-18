import asyncio
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI
from telethon import TelegramClient
from telethon.tl.types import Message

load_dotenv(Path(__file__).parent / ".env")

API_ID = int(os.environ["TELEGRAM_API_ID"])
API_HASH = os.environ["TELEGRAM_API_HASH"]
OPENAI_KEY = os.environ.get("OPENAI_API_KEY") or os.environ.get("VITE_OPENAI_API_KEY")
CHANNEL = "mentoria_organization"
TOP_K = 50
OUT_FILE = Path(__file__).parent / "opportunities.json"

openai_client = OpenAI(api_key=OPENAI_KEY) if OPENAI_KEY else None

EXTRACT_PROMPT = """You extract structured info about an educational opportunity from a Telegram post.

Return STRICT JSON with these fields:
- "title": short clean title (max 80 chars)
- "category": one of "Competition", "Scholarship", "Internship", "Summer School", "Research", "Volunteering", "Course", "Event", "Opportunity"
- "direction": one of "STEM", "Science", "Business", "Finance", "Programming", "Social Impact", "Admissions", "General"
- "deadline": application deadline as ISO date "YYYY-MM-DD", ONLY if an explicit day is given (for example, "until June 18" in any source language, or "deadline July 5"). Otherwise null.
- "event_date": when the event itself happens as ISO date "YYYY-MM-DD", ONLY if an explicit day is given. Otherwise null.
- "is_recurring": true if it's a yearly/recurring event (e.g. annual olympiad), else false
- "tags": array of lowercase keyword tags
- "source_language": ISO-like language code for the original post, usually "en", "ru", or "kk"
- "translations": object with an "en" object:
  - "title": concise English display title (max 80 chars)
  - "description": concise English student-facing summary, 1-2 sentences
  - "requirements": concise English participation/eligibility/action details, 1 sentence
  - "summary": concise English summary, 1 sentence

CRITICAL date rules:
- Only output a date when the post gives a SPECIFIC DAY. Vague timing like "in June", "this summer", "in autumn", "soon", or "this month" in any source language must be null — do NOT invent a day. Guessing a day can wrongly hide an active opportunity.
- If a date has a day but no year, assume the nearest future year relative to 2026.
- If registration is described as currently open with no closing day, set deadline null.

The post may be in Russian or Kazakh. Translate/summarize student-facing display fields into English.
Respond with ONLY the JSON object, no markdown."""


def extract_with_llm(text: str) -> dict:
    """Use GPT-4o-mini to extract structured deadline/status info."""
    if not openai_client:
        return {}
    try:
        resp = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": EXTRACT_PROMPT},
                {"role": "user", "content": text[:3000]},
            ],
        )
        return json.loads(resp.choices[0].message.content)
    except Exception as e:
        print(f"  LLM extract failed: {e}")
        return {}


def post_to_opportunity(msg: Message) -> dict:
    text = msg.message or ""
    first_line = text.split("\n")[0][:80].strip()
    extracted = extract_with_llm(text)
    translations = extracted.get("translations") or {}
    english = translations.get("en") or {}
    source_title = first_line or f"Post #{msg.id}"
    display_title = english.get("title") or extracted.get("title") or source_title
    display_description = english.get("description") or "Details are available in the source announcement."
    display_requirements = english.get("requirements") or "Review the source announcement for participation details."

    return {
        "id": f"tg-{msg.id}",
        "title": display_title,
        "category": extracted.get("category", "Opportunity"),
        "direction": extracted.get("direction", "General"),
        "format": "Online",
        "deadline": extracted.get("deadline"),       # ISO date or null
        "eventDate": extracted.get("event_date"),     # ISO date or null
        "isRecurring": extracted.get("is_recurring", False),
        "grades": ["8", "9", "10", "11", "12"],
        "location": "Global",
        "description": display_description,
        "summary": english.get("summary") or display_description,
        "requirements": display_requirements,
        "tags": extracted.get("tags", []),
        "applyUrl": f"https://t.me/{CHANNEL}/{msg.id}",
        "postedAt": msg.date.date().isoformat() if msg.date else None,
        "views": msg.views or 0,
        "sourceLanguage": extracted.get("source_language") or "ru",
        "sourceTitle": source_title,
        "sourceDescription": text.strip(),
        "sourceRequirements": "",
        "translations": {
            "en": {
                "title": display_title,
                "description": display_description,
                "requirements": display_requirements,
                "summary": english.get("summary") or display_description,
            }
        },
    }


async def fetch():
    async with TelegramClient("mentoria_session", API_ID, API_HASH) as client:
        posts = []
        async for msg in client.iter_messages(CHANNEL, limit=500):
            if msg.message and msg.views:
                posts.append(msg)

        top = sorted(posts, key=lambda m: m.views, reverse=True)[:TOP_K]
        print(f"Extracting structured data from {len(top)} posts via GPT-4o-mini...")

        opportunities = []
        for i, msg in enumerate(top, 1):
            print(f"  [{i}/{len(top)}] post {msg.id}")
            opportunities.append(post_to_opportunity(msg))

        OUT_FILE.write_text(
            json.dumps(opportunities, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(f"Saved {len(opportunities)} opportunities -> {OUT_FILE}")


if __name__ == "__main__":
    asyncio.run(fetch())
