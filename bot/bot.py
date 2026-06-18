"""MentoriaHub Telegram bot — subscriptions, deadline reminders, admin broadcast,
and a contest randomizer.

Run locally:  python bot.py   (long-polling)
"""

import asyncio
import random

from aiogram import Bot, Dispatcher, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import Command, CommandObject
from aiogram.types import Message
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from config import BOT_TOKEN, REMINDER_INTERVAL_HOURS, is_admin
import reminders
import storage

bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()


# ── User commands ─────────────────────────────────────────────

@dp.message(Command("start"))
async def cmd_start(message: Message) -> None:
    storage.add_subscriber(message.chat.id, message.from_user.username if message.from_user else None)
    await message.answer(
        "👋 Привет! Я <b>MentorPet</b> от Mentoria Hub.\n\n"
        "Я буду напоминать о дедлайнах конкурсов и возможностей.\n\n"
        "• /setreminder N — напоминать за N дней до дедлайна (по умолчанию 3)\n"
        "• /me — мои настройки\n"
        "• /stop — отписаться"
    )


@dp.message(Command("setreminder"))
async def cmd_setreminder(message: Message, command: CommandObject) -> None:
    arg = (command.args or "").strip()
    if not arg.isdigit() or not (1 <= int(arg) <= 60):
        await message.answer("Укажи число дней от 1 до 60. Например: <code>/setreminder 5</code>")
        return
    storage.set_reminder_days(message.chat.id, int(arg))
    await message.answer(f"Готово — напомню за <b>{int(arg)}</b> дн. до дедлайна. ✅")


@dp.message(Command("me"))
async def cmd_me(message: Message) -> None:
    sub = storage.get_subscriber(message.chat.id)
    if not sub:
        await message.answer("Ты ещё не подписан. Нажми /start.")
        return
    await message.answer(f"🔔 Напоминаю за <b>{sub.get('reminder_days', 3)}</b> дн. до дедлайна.")


@dp.message(Command("stop"))
async def cmd_stop(message: Message) -> None:
    storage.remove_subscriber(message.chat.id)
    await message.answer("Отписал. Возвращайся в любой момент — /start 👋")


# ── Admin commands ────────────────────────────────────────────

@dp.message(Command("broadcast"))
async def cmd_broadcast(message: Message, command: CommandObject) -> None:
    if not is_admin(message.from_user.id):
        return
    text = (command.args or "").strip()
    if not text:
        await message.answer("Использование: <code>/broadcast текст сообщения</code>")
        return
    subs = storage.list_subscribers()
    sent = 0
    for sub in subs:
        try:
            await bot.send_message(sub["chat_id"], text, disable_web_page_preview=True)
            sent += 1
        except Exception:
            pass
        await asyncio.sleep(0.05)  # stay under Telegram rate limits
    await message.answer(f"📣 Отправлено {sent}/{len(subs)}.")


@dp.message(Command("raffle"))
async def cmd_raffle(message: Message, command: CommandObject) -> None:
    if not is_admin(message.from_user.id):
        return
    subs = storage.list_subscribers()
    if not subs:
        await message.answer("Пока нет подписчиков для розыгрыша.")
        return
    arg = (command.args or "").strip()
    winners_count = int(arg) if arg.isdigit() else 1
    winners_count = max(1, min(winners_count, len(subs)))
    winners = random.sample(subs, winners_count)

    def label(s: dict) -> str:
        return f"@{s['username']}" if s.get("username") else f"id {s['chat_id']}"

    await message.answer(
        "🎲 <b>Розыгрыш!</b>\nПобедител{}: {}".format(
            "и" if winners_count > 1 else "ь",
            ", ".join(label(w) for w in winners),
        )
    )


# ── Scheduler + entrypoint ────────────────────────────────────

async def main() -> None:
    scheduler = AsyncIOScheduler()
    scheduler.add_job(reminders.run_reminders, "interval", hours=REMINDER_INTERVAL_HOURS, args=[bot])
    scheduler.start()

    # Run once on startup so reminders aren't delayed until the first interval.
    await reminders.run_reminders(bot)

    print("MentoriaHub bot is running (polling). Press Ctrl+C to stop.")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
