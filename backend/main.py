import os
import asyncio
import threading
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
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


# Проверка здоровья
@app.get("/api/health")
def health():
    static_dir = Path(__file__).parent / "static"
    has_static = static_dir.is_dir()
    files = list(static_dir.iterdir()) if has_static else []
    return {
        "status": "ok",
        "static_dir_exists": has_static,
        "static_files_count": len(files),
        "static_files": [f.name for f in files[:10]],
    }


# --- Telegram бот в фоновом потоке ---
def start_bot():
    try:
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
                "Привет! Мы MeetMates — поможем найти тебе спутника для путешествий и прогулок!\n\n"
                "Нажми кнопку ниже, чтобы начать!",
                reply_markup=keyboard,
            )

        async def admin_stats(update, context):
            tg_id = update.effective_user.id
            # Проверяем is_admin в Supabase
            check = supabase.table("users").select("is_admin").eq("telegram_id", tg_id).execute()
            if not check.data or not check.data[0].get("is_admin"):
                await update.message.reply_text("Нет доступа.")
                return
            try:
                users_result = supabase.table("users").select("id", count="exact").execute()
                matches_result = supabase.table("matches").select("id", count="exact").execute()
                ratings_result = supabase.table("ratings").select("id", count="exact").execute()

                total_users = users_result.count if users_result.count is not None else len(users_result.data)
                total_matches = matches_result.count if matches_result.count is not None else len(matches_result.data)
                total_ratings = ratings_result.count if ratings_result.count is not None else len(ratings_result.data)

                text = (
                    f"📊 Статистика MeetMates\n\n"
                    f"👥 Пользователей: {total_users}\n"
                    f"🤝 Мэтчей: {total_matches}\n"
                    f"⭐ Оценок: {total_ratings}\n"
                )
                await update.message.reply_text(text)
            except Exception as e:
                await update.message.reply_text(f"Ошибка: {e}")

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        application = Application.builder().token(BOT_TOKEN).build()
        application.add_handler(CommandHandler("start", start))
        application.add_handler(CommandHandler("stats", admin_stats))

        async def run():
            await application.initialize()
            await application.start()
            await application.updater.start_polling(drop_pending_updates=True)
            print("Бот запущен!")
            while True:
                await asyncio.sleep(3600)

        loop.run_until_complete(run())
    except Exception as e:
        print(f"Ошибка бота: {e}")


@app.on_event("startup")
def on_startup():
    bot_thread = threading.Thread(target=start_bot, daemon=True)
    bot_thread.start()


# --- Отдача фронтенда как статики ---
STATIC_DIR = Path(__file__).parent / "static"

if STATIC_DIR.is_dir():
    print(f"Статика найдена: {STATIC_DIR}, файлов: {len(list(STATIC_DIR.iterdir()))}")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        index = STATIC_DIR / "index.html"
        if index.is_file():
            return FileResponse(str(index))
        return JSONResponse({"error": "index.html not found"}, status_code=500)
else:
    print(f"ВНИМАНИЕ: Статика НЕ найдена в {STATIC_DIR}")

    @app.get("/")
    def root():
        return {"error": "Frontend not built", "static_dir": str(STATIC_DIR)}
