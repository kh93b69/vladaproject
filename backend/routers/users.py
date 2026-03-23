from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import math
import random

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


# Данные для генерации фейковых гидов
FAKE_NAMES = [
    "Мария", "Ахмед", "Лейла", "Дженк", "Айше",
    "Карлос", "София", "Юки", "Пьер", "Анна",
    "Марко", "Изабель", "Хироши", "Елена", "Рауль",
]

FAKE_AVATARS = ["green-hat", "purple-viking", "red-bun", "lavender-beret", "pink-sombrero"]

ALL_INTERESTS = ["bars", "clubs", "walks", "food", "nature", "art", "sport", "shopping", "history", "nightlife", "local_food", "trips", "new_things"]

FAKE_DESCRIPTIONS = [
    "Поехали с нами на шашлыки!",
    "Покажу лучшие кофейни города",
    "Знаю все секретные бары в центре",
    "Люблю пешие прогулки по старому городу",
    "Могу показать места, которых нет в путеводителях",
    "Обожаю уличную еду, покажу лучшие точки!",
    "Знаю крутые смотровые площадки",
    "Поедем на природу за город!",
    "Покажу ночную жизнь города",
    "Расскажу историю каждого здания",
    "Давай сходим на местный рынок",
    "Знаю классные спортивные площадки",
]


def generate_fake_guides(lat: float, lon: float, count: int = 5) -> list:
    """Генерация фейковых гидов рядом с пользователем"""
    guides = []
    used_names = set()

    for i in range(count):
        # Случайное смещение: 0.5-5 км от пользователя
        offset_lat = random.uniform(-0.03, 0.03)
        offset_lon = random.uniform(-0.03, 0.03)

        # Уникальное имя
        name = random.choice([n for n in FAKE_NAMES if n not in used_names] or FAKE_NAMES)
        used_names.add(name)

        # Случайные интересы (2-4 штуки)
        interests = random.sample(ALL_INTERESTS, random.randint(2, 4))

        fake_lat = lat + offset_lat
        fake_lon = lon + offset_lon
        distance = haversine_distance(lat, lon, fake_lat, fake_lon)

        guides.append({
            "telegram_id": 900000 + i,
            "name": name,
            "country": "Местный",
            "role": "local",
            "interests": interests,
            "avatar": random.choice(FAKE_AVATARS),
            "latitude": round(fake_lat, 6),
            "longitude": round(fake_lon, 6),
            "distance_km": round(distance, 1),
            "description": random.choice(FAKE_DESCRIPTIONS),
            "avg_rating": round(random.uniform(6.0, 9.8), 1),
            "is_fake": True,
        })

    guides.sort(key=lambda x: x["distance_km"])
    return guides


@router.post("/")
def create_user(user: UserCreate):
    """Создать нового пользователя или вернуть существующего"""
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
    current = supabase.table("users").select("*").eq("telegram_id", telegram_id).execute()
    if not current.data:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    user = current.data[0]
    if not user.get("latitude") or not user.get("longitude"):
        raise HTTPException(status_code=400, detail="Геолокация не указана")

    # Ищем реальных пользователей (всех, кроме себя)
    others = supabase.table("users").select("*").neq("telegram_id", telegram_id).execute()

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

    # Если реальных мало — добавляем фейковых гидов
    if len(nearby) < 3:
        fakes_needed = 5 - len(nearby)
        fakes = generate_fake_guides(user["latitude"], user["longitude"], fakes_needed)
        nearby.extend(fakes)

    nearby.sort(key=lambda x: x["distance_km"])
    return nearby
