from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

from main import supabase


class MatchCreate(BaseModel):
    user_telegram_id: int
    mate_telegram_id: int


@router.post("/")
def create_match(match: MatchCreate):
    """Создать матч (нажатие кнопки 'Погнали!')"""
    # Получаем UUID обоих пользователей
    user = supabase.table("users").select("id").eq("telegram_id", match.user_telegram_id).execute()
    mate = supabase.table("users").select("id").eq("telegram_id", match.mate_telegram_id).execute()

    if not user.data or not mate.data:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    result = supabase.table("matches").insert({
        "user_id": user.data[0]["id"],
        "mate_id": mate.data[0]["id"],
        "status": "pending",
    }).execute()

    return result.data[0]


@router.patch("/{match_id}/status")
def update_match_status(match_id: str, status: str):
    """Обновить статус матча"""
    if status not in ("pending", "accepted", "completed"):
        raise HTTPException(status_code=400, detail="Неверный статус")

    result = supabase.table("matches").update({"status": status}).eq("id", match_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Матч не найден")
    return result.data[0]


@router.get("/user/{telegram_id}")
def get_user_matches(telegram_id: int):
    """Получить все матчи пользователя"""
    user = supabase.table("users").select("id").eq("telegram_id", telegram_id).execute()
    if not user.data:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    user_id = user.data[0]["id"]
    matches = supabase.table("matches").select("*").or_(
        f"user_id.eq.{user_id},mate_id.eq.{user_id}"
    ).execute()

    return matches.data
