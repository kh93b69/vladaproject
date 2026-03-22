from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

from main import supabase


class RatingCreate(BaseModel):
    from_telegram_id: int
    to_telegram_id: int
    safety: int
    experience: int
    communication: int


@router.post("/")
def create_rating(rating: RatingCreate):
    """Создать оценку спутника"""
    # Проверяем значения
    for field in [rating.safety, rating.experience, rating.communication]:
        if not 1 <= field <= 10:
            raise HTTPException(status_code=400, detail="Оценка должна быть от 1 до 10")

    # Получаем UUID пользователей
    from_user = supabase.table("users").select("id").eq("telegram_id", rating.from_telegram_id).execute()
    to_user = supabase.table("users").select("id").eq("telegram_id", rating.to_telegram_id).execute()

    if not from_user.data or not to_user.data:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    result = supabase.table("ratings").insert({
        "from_user_id": from_user.data[0]["id"],
        "to_user_id": to_user.data[0]["id"],
        "safety": rating.safety,
        "experience": rating.experience,
        "communication": rating.communication,
    }).execute()

    return result.data[0]


@router.get("/user/{telegram_id}")
def get_user_ratings(telegram_id: int):
    """Получить все оценки пользователя (полученные)"""
    user = supabase.table("users").select("id").eq("telegram_id", telegram_id).execute()
    if not user.data:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    ratings = supabase.table("ratings").select("*").eq("to_user_id", user.data[0]["id"]).execute()

    # Считаем средние оценки
    if not ratings.data:
        return {"ratings": [], "average": None}

    total = len(ratings.data)
    avg_safety = sum(r["safety"] for r in ratings.data) / total
    avg_experience = sum(r["experience"] for r in ratings.data) / total
    avg_communication = sum(r["communication"] for r in ratings.data) / total

    return {
        "ratings": ratings.data,
        "average": {
            "safety": round(avg_safety, 1),
            "experience": round(avg_experience, 1),
            "communication": round(avg_communication, 1),
            "overall": round((avg_safety + avg_experience + avg_communication) / 3, 1),
        }
    }
