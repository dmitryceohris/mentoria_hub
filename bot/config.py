import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

BOT_TOKEN = os.environ["BOT_TOKEN"]

ADMIN_IDS = {
    int(x.strip())
    for x in os.environ.get("ADMIN_IDS", "").split(",")
    if x.strip().isdigit()
}

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
OPENAI_MODEL = "gpt-4o-mini"
EMBED_MODEL = "text-embedding-3-small"

# Public links the assistant shares with students.
CHANNEL_URL = "https://t.me/mentoria_organization"
SITE_URL = "https://mentoria-hub-ruddy.vercel.app/"

# If set, opportunities are fetched over HTTP; otherwise read from the local file.
OPPORTUNITIES_URL = os.environ.get("OPPORTUNITIES_URL", "").strip()
LOCAL_OPPORTUNITIES = Path(__file__).parent.parent / "public" / "recsys" / "opportunities.json"

# How often (hours) the reminder job runs.
REMINDER_INTERVAL_HOURS = 12

# Default "remind me N days before the deadline" if the user hasn't set one.
DEFAULT_REMINDER_DAYS = 3


def is_admin(user_id: int) -> bool:
    return user_id in ADMIN_IDS
