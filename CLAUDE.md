# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Проект MeetMates
Telegram Mini App для путешественников — соединяет туристов с местными жителями.

## Команды
- Frontend: `cd frontend && npm run dev` (порт 5173)
- Backend: `cd backend && uvicorn main:app --reload` (порт 8000)
- Bot: `cd bot && python bot.py`

## Архитектура
- `frontend/` — React + Vite + TypeScript (Telegram Mini App)
- `backend/` — Python + FastAPI (API сервер)
- `bot/` — python-telegram-bot (Telegram бот с кнопкой Mini App)
- `supabase/init.sql` — SQL-скрипт создания таблиц
- БД: Supabase (PostgreSQL), деплой: Railway

## Инструкции

- Всегда отвечать на русском языке
- Писать комментарии в коде на русском
- Объяснять ошибки и предложения на русском
- Используй Sequential Thinking для сложных размышлений
- Никогда не используй наследование, присваивание классу внешних функций, рефлексию и другие сложные техники. Код должен быь понятен Junior разработчику с минимальным опытом
- Используй Context7 для досткупа к документации всех библиотек
- Для реализации любых фич с использованием интеграций с внешним api/библиотеками изучай документации с помощью Context7 инструментов
- Если есть изменения на фронтенде, то проверь что фронт работает, открыв его через Playwright