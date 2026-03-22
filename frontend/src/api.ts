// Базовый URL бэкенда — при деплое заменить на реальный
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Универсальная функция для запросов к API
async function request(path: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Ошибка сервера");
  }

  return response.json();
}

// --- Users ---

export function createUser(data: {
  telegram_id: number;
  name: string;
  country: string;
  role: string;
  interests: string[];
  avatar: string;
}) {
  return request("/api/users/", { method: "POST", body: JSON.stringify(data) });
}

export function getUser(telegramId: number) {
  return request(`/api/users/${telegramId}`);
}

export function updateUser(telegramId: number, data: Record<string, unknown>) {
  return request(`/api/users/${telegramId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function getNearbyUsers(telegramId: number, radiusKm = 50) {
  return request(`/api/users/${telegramId}/nearby?radius_km=${radiusKm}`);
}

// --- Matches ---

export function createMatch(userTelegramId: number, mateTelegramId: number) {
  return request("/api/matches/", {
    method: "POST",
    body: JSON.stringify({
      user_telegram_id: userTelegramId,
      mate_telegram_id: mateTelegramId,
    }),
  });
}

// --- Ratings ---

export function createRating(data: {
  from_telegram_id: number;
  to_telegram_id: number;
  safety: number;
  experience: number;
  communication: number;
}) {
  return request("/api/ratings/", { method: "POST", body: JSON.stringify(data) });
}

export function getUserRatings(telegramId: number) {
  return request(`/api/ratings/user/${telegramId}`);
}
