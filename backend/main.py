import os
import asyncio
import threading
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

app = FastAPI(title="MeetMates API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение к Supabase
supabase = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_KEY", ""),
)

from routers import users, matches, ratings

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(matches.router, prefix="/api/matches", tags=["matches"])
app.include_router(ratings.router, prefix="/api/ratings", tags=["ratings"])


# --- Telegram бот в фоновом потоке ---
def start_bot():
    from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
    from telegram.ext import Application, CommandHandler

    BOT_TOKEN = os.getenv("BOT_TOKEN", "")
    WEBAPP_URL = os.getenv("WEBAPP_URL", "")

    if not BOT_TOKEN or not WEBAPP_URL:
        print(f"BOT_TOKEN={'set' if BOT_TOKEN else 'EMPTY'}, WEBAPP_URL={'set' if WEBAPP_URL else 'EMPTY'} — бот не запущен")
        return

    print(f"Запускаю бота с WEBAPP_URL={WEBAPP_URL}")

    async def start(update, context):
        keyboard = InlineKeyboardMarkup([
            [InlineKeyboardButton(
                text="Открыть MeetMates",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )]
        ])
        await update.message.reply_text(
            "Привет! Я MeetMates — помогу найти интересных людей рядом с тобой.\n\n"
            "Нажми кнопку ниже, чтобы начать!",
            reply_markup=keyboard,
        )

    # Создаём свой event loop для потока и запускаем бота вручную
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    application = Application.builder().token(BOT_TOKEN).build()
    application.add_handler(CommandHandler("start", start))

    async def run():
        await application.initialize()
        await application.start()
        await application.updater.start_polling(drop_pending_updates=True)
        print("Бот запущен!")
        # Держим бота живым
        while True:
            await asyncio.sleep(3600)

    loop.run_until_complete(run())


@app.on_event("startup")
def on_startup():
    # Запускаем бота в отдельном потоке
    bot_thread = threading.Thread(target=start_bot, daemon=True)
    bot_thread.start()


# --- Отдача фронтенда как статики ---
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

if os.path.isdir(STATIC_DIR):
    # API-роуты уже подключены выше, статику подключаем последней
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Если файл существует — отдаём его
        file_path = os.path.join(STATIC_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        # Иначе — отдаём index.html (SPA routing)
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
