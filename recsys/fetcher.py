import asyncio
import json
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from telethon import TelegramClient
from telethon.tl.types import Message

load_dotenv(Path(__file__).parent / ".env")

API_ID = int(os.environ["TELEGRAM_API_ID"])
API_HASH = os.environ["TELEGRAM_API_HASH"]
CHANNEL = "mentoria_organization"
TOP_K = 50
OUT_FILE = Path(__file__).parent / "opportunities.json"


def parse_deadline(text: str) -> str:
    """Extract a deadline date from post text, fallback to empty string."""
    match = re.search(r"\b(\d{1,2})[./](\d{1,2})[./](\d{2,4})\b", text or "")
    if match:
        d, m, y = match.groups()
        y = f"20{y}" if len(y) == 2 else y
        return f"{y}-{m.zfill(2)}-{d.zfill(2)}"
    return ""


def post_to_opportunity(msg: Message, rank: int) -> dict:
    text = msg.message or ""
    first_line = text.split("\n")[0][:80].strip()
    return {
        "id": f"tg-{msg.id}",
        "title": first_line or f"Post #{msg.id}",
        "category": "Opportunity",
        "direction": "STEM",
        "format": "Online",
        "deadline": parse_deadline(text),
        "grades": ["8", "9", "10", "11", "12"],
        "location": "Global",
        "description": text[:300].strip(),
        "requirements": "",
        "tags": [],
        "applyUrl": f"https://t.me/mentoria_organization/{msg.id}",
        "views": msg.views or 0,
    }


async def fetch():
    async with TelegramClient("mentoria_session", API_ID, API_HASH) as client:
        posts = []
        async for msg in client.iter_messages(CHANNEL, limit=500):
            if msg.message and msg.views:
                posts.append(msg)

        top = sorted(posts, key=lambda m: m.views, reverse=True)[:TOP_K]
        opportunities = [post_to_opportunity(msg, i) for i, msg in enumerate(top)]

        OUT_FILE.write_text(json.dumps(opportunities, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Saved {len(opportunities)} opportunities → {OUT_FILE}")


if __name__ == "__main__":
    asyncio.run(fetch())
