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
from aiogram.types import (
    BufferedInputFile,
    CallbackQuery,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    Message,
)
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from config import BOT_TOKEN, CHANNEL_POST_TARGET, REMINDER_INTERVAL_HOURS, is_admin
import ai
import cards
import reminders
import retrieval
import storage

bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()

GREETING = (
    "Привет! Меня зовут <b>MentorLM</b> от Mentoria Hub — сообщество, где пересекаются "
    "новости, общение, олимпиады, конкурсы, гранты и стажировки.\n"
    "Я очень полезный помощник. Можешь задавать мне любые вопросы. И нет, я не кусаюсь =)\n\n"
    "──────────\n"
    "📢 Канал: https://t.me/mentoria_organization\n"
    "🌐 Сайт: https://mentoria-hub-ruddy.vercel.app/"
)

ERROR_TEMPLATE = "Упс.. у нас какие-то неполадки. Передайте админу код: <code>{code}</code>"

MAX_REMINDER_DAYS = 7


def error_code(exc: Exception) -> str:
    """Short code to relay to the admin (never leak secrets)."""
    code = getattr(exc, "code", None)
    if code:
        return str(code)
    return type(exc).__name__


# ── User commands ─────────────────────────────────────────────

@dp.message(Command("start"))
async def cmd_start(message: Message) -> None:
    try:
        storage.add_subscriber(message.chat.id, message.from_user.username if message.from_user else None)
    except Exception as e:
        await message.answer(ERROR_TEMPLATE.format(code=error_code(e)))
        return
    await message.answer(GREETING, disable_web_page_preview=True)


@dp.message(Command("setreminder"))
async def cmd_setreminder(message: Message, command: CommandObject) -> None:
    arg = (command.args or "").strip()
    if not arg.isdigit() or not (1 <= int(arg) <= MAX_REMINDER_DAYS):
        await message.answer(
            f"Укажи число дней от 1 до {MAX_REMINDER_DAYS}. Например: <code>/setreminder 5</code>"
        )
        return
    try:
        storage.set_reminder_days(message.chat.id, int(arg))
    except Exception as e:
        await message.answer(ERROR_TEMPLATE.format(code=error_code(e)))
        return
    await message.answer("Готово! Установлен.")


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


# ── Achievement share-cards ───────────────────────────────────

# Remembers the last generated card per chat so the "publish" button can repost it.
_last_card: dict[int, tuple[str, str]] = {}


@dp.message(Command("card"))
async def cmd_card(message: Message, command: CommandObject) -> None:
    achievement = (command.args or "").strip() or "Завершил курс на Mentoria"
    name = (message.from_user.full_name if message.from_user else None) or "Студент Mentoria"
    png = cards.generate_card(name, achievement)
    _last_card[message.chat.id] = (name, achievement)
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text="📢 Опубликовать в канал", callback_data="postcard")]]
    )
    await bot.send_photo(
        message.chat.id,
        BufferedInputFile(png, filename="achievement.png"),
        caption="🎉 Твоя карточка достижения! Можешь переслать её куда угодно.",
        reply_markup=keyboard,
    )


@dp.callback_query(F.data == "postcard")
async def on_postcard(cb: CallbackQuery) -> None:
    data = _last_card.get(cb.message.chat.id)
    if not data:
        await cb.answer("Карточка не найдена — создай заново через /card", show_alert=True)
        return
    name, achievement = data
    png = cards.generate_card(name, achievement)
    try:
        await bot.send_photo(
            CHANNEL_POST_TARGET,
            BufferedInputFile(png, filename="achievement.png"),
            caption=f"🎉 {name} — {achievement}",
        )
    except Exception as e:
        await cb.answer("Не удалось опубликовать", show_alert=False)
        await bot.send_message(
            cb.message.chat.id,
            ERROR_TEMPLATE.format(code=error_code(e)) + "\n(бот должен быть админом канала)",
        )
        return
    await cb.answer("Опубликовано! 📢")
    await cb.message.answer("✅ Карточка опубликована в канал!")


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


# ── Free-form AI chat (any non-command text) ──────────────────

@dp.message(F.text & ~F.text.startswith("/"))
async def ai_chat(message: Message) -> None:
    await bot.send_chat_action(message.chat.id, "typing")
    try:
        reply, suggestion = await asyncio.to_thread(ai.answer_with_suggestion, message.text)
    except Exception as e:
        await message.answer(ERROR_TEMPLATE.format(code=error_code(e)))
        return

    keyboard = None
    if suggestion:
        title = suggestion.get("title", "событие")
        short = title if len(title) <= 28 else title[:27] + "…"
        keyboard = InlineKeyboardMarkup(
            inline_keyboard=[[
                InlineKeyboardButton(
                    text=f"🔔 Напомнить про {short}",
                    callback_data=f"remind:{suggestion['id']}",
                )
            ]]
        )

    await message.answer(reply, disable_web_page_preview=True, reply_markup=keyboard)


@dp.callback_query(F.data.startswith("remind:"))
async def on_remind(cb: CallbackQuery) -> None:
    opp_id = cb.data.split(":", 1)[1]
    opp = retrieval.get_opportunity(opp_id)
    chat_id = cb.message.chat.id
    try:
        storage.add_subscriber(chat_id, cb.from_user.username if cb.from_user else None)
        storage.add_event_reminder(chat_id, opp_id)
    except Exception as e:
        await cb.answer("Не получилось 😔", show_alert=False)
        await bot.send_message(chat_id, ERROR_TEMPLATE.format(code=error_code(e)))
        return

    title = opp.get("title") if opp else "событие"
    await cb.answer("Готово! 🔔")
    await cb.message.answer(f"🔔 Напомню тебе про <b>{title}</b> перед дедлайном!")


# ── Scheduler + entrypoint ────────────────────────────────────

async def main() -> None:
    scheduler = AsyncIOScheduler()
    scheduler.add_job(reminders.run_reminders, "interval", hours=REMINDER_INTERVAL_HOURS, args=[bot])
    scheduler.start()

    # Run once on startup so reminders aren't delayed until the first interval.
    # Non-fatal: a DB/data hiccup here must not stop the bot from starting.
    try:
        await reminders.run_reminders(bot)
    except Exception as e:
        print(f"Startup reminder run skipped: {e}")

    print("MentoriaHub bot is running (polling). Press Ctrl+C to stop.")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
