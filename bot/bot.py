import os
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "")
# URL фронтенда (Mini App) — заменить на реальный после деплоя
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://your-app.up.railway.app")


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /start — приветствие с кнопкой открытия Mini App"""
    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton(
            text="Открыть MeetMates",
            web_app=WebAppInfo(url=WEBAPP_URL)
        )]
    ])

    await update.message.send_message(
        chat_id=update.effective_chat.id,
        text="Привет! Я MeetMates — помогу найти интересных людей рядом с тобой.\n\n"
             "Нажми кнопку ниже, чтобы начать!",
        reply_markup=keyboard,
    )


def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    print("Бот запущен!")
    app.run_polling()


if __name__ == "__main__":
    main()
