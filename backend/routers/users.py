from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import math

router = APIRouter()

# Импортируем supabase из main
from main import supabase


class UserCreate(BaseModel):
    telegram_id: int
    name: str
    country: str
    role: str  # 'local' или 'tourist'
    interests: list[str] = []
    avatar: str = "green-hat"


class UserUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    role: Optional[str] = None
    interests: Optional[list[str]] = None
    avatar: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


@router.post("/")
def create_user(user: UserCreate):
    """Создать нового пользователя или вернуть существующего"""
    # Проверяем, есть ли уже пользователь с таким telegram_id
    existing = supabase.table("users").select("*").eq("telegram_id", user.telegram_id).execute()
    if existing.data:
        return existing.data[0]

    result = supabase.table("users").insert(user.model_dump()).execute()
    return result.data[0]


@router.get("/{telegram_id}")
def get_user(telegram_id: int):
    """Получить пользователя по telegram_id"""
    result = supabase.table("users").select("*").eq("telegram_id", telegram_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return result.data[0]


@router.patch("/{telegram_id}")
def update_user(telegram_id: int, user: UserUpdate):
    """Обновить данные пользователя"""
    data = {k: v for k, v in user.model_dump().items() if v is not None}
    result = supabase.table("users").update(data).eq("telegram_id", telegram_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return result.data[0]


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Расстояние между двумя точками в км (формула Гаверсинуса)"""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))
    return R * c


@router.get("/{telegram_id}/nearby")
def get_nearby_users(telegram_id: int, radius_km: float = 50):
    """Найти ближайших пользователей с противоположной ролью"""
    # Получаем текущего пользователя
    current = supabase.table("users").select("*").eq("telegram_id", telegram_id).execute()
    if not current.data:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    user = current.data[0]
    if not user.get("latitude") or not user.get("longitude"):
        raise HTTPException(status_code=400, detail="Геолокация не указана")

    # Ищем пользователей с противоположной ролью
    opposite_role = "local" if user["role"] == "tourist" else "tourist"
    others = supabase.table("users").select("*").eq("role", opposite_role).neq("telegram_id", telegram_id).execute()

    # Фильтруем по расстоянию
    nearby = []
    for other in others.data:
        if other.get("latitude") and other.get("longitude"):
            distance = haversine_distance(
                user["latitude"], user["longitude"],
                other["latitude"], other["longitude"]
            )
            if distance <= radius_km:
                other["distance_km"] = round(distance, 1)
                nearby.append(other)

    nearby.sort(key=lambda x: x["distance_km"])
    return nearby
