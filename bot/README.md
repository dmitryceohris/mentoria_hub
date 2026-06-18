# MentoriaHub Telegram bot

Deadline reminders, admin broadcast, and a contest randomizer. Subscribers are
stored in Supabase (shared with the website); opportunity data is reused from
`recsys/opportunities.json`.

## Setup

1. Install deps:
   ```bash
   cd bot
   pip install -r requirements.txt
   ```

2. Create the Supabase tables — run `supabase_schema.sql` in the Supabase SQL editor.

3. Copy `.env.example` → `.env` and fill in:
   - `BOT_TOKEN` — from BotFather (keep secret, never commit)
   - `ADMIN_IDS` — your Telegram user id(s), comma-separated
   - `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` — service-role key (server-side only)
   - `OPPORTUNITIES_URL` — optional; e.g. `https://<your-vercel>.vercel.app/recsys/opportunities.json`.
     If empty, reads the local `../public/recsys/opportunities.json`.

4. Run (long-polling, good for demo):
   ```bash
   python bot.py
   ```

## Commands

| Command | Who | What |
|---|---|---|
| `/start` | everyone | subscribe to reminders |
| `/setreminder N` | everyone | remind N days before a deadline |
| `/me` | everyone | show current setting |
| `/stop` | everyone | unsubscribe |
| `/broadcast <text>` | admin | message all subscribers |
| `/raffle [N]` | admin | pick N random winners (default 1) |

## Reminders

A scheduled job (every `REMINDER_INTERVAL_HOURS`) checks each opportunity:
- within the subscriber's window → "⏰ X days left, register!"
- deadline passed → "🔒 registration closed" (once)

Recurring opportunities are skipped. Sent notices are de-duplicated via
`bot_reminders_sent`.

## Production note

Vercel serverless can't run a polling loop. For 24/7, switch to **webhook**
(Telegram → a serverless function) + **Vercel Cron** to trigger
`reminders.run_reminders`. The storage and reminder logic stay the same.
