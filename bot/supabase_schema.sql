-- Run once in the Supabase SQL editor to create the bot tables.

create table if not exists public.bot_subscribers (
  chat_id       bigint primary key,
  username      text,
  reminder_days int not null default 3,
  subscribed_at timestamptz not null default now()
);

create table if not exists public.bot_reminders_sent (
  chat_id        bigint not null,
  opportunity_id text not null,
  kind           text not null,            -- 'upcoming' | 'closed'
  sent_at        timestamptz not null default now(),
  primary key (chat_id, opportunity_id, kind)
);

-- Per-event reminders the user opted into via the inline "🔔 Напомнить" button.
create table if not exists public.bot_event_reminders (
  chat_id        bigint not null,
  opportunity_id text not null,
  created_at     timestamptz not null default now(),
  primary key (chat_id, opportunity_id)
);
alter table public.bot_event_reminders enable row level security;

-- The bot uses the service-role key, so RLS is bypassed. Keep these tables
-- locked down from the public anon key (no public policies added on purpose).
alter table public.bot_subscribers enable row level security;
alter table public.bot_reminders_sent enable row level security;
