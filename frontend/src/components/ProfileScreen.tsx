import { useEffect, useState } from "react";
import { getUserRatings, createMatch } from "../api";

interface User {
  telegram_id: number;
  name: string;
  role: string;
  interests: string[];
  avatar: string;
  country?: string;
  distance_km?: number;
}

// Маппинг интересов
const INTEREST_LABELS: Record<string, string> = {
  bars: "Бары",
  clubs: "Клубы",
  quiet: "Тихие места",
  crowded: "Людные места",
  nature: "Природа",
  food: "Еда",
  art: "Искусство",
  sport: "Спорт",
  shopping: "Шопинг",
  history: "История",
  nightlife: "Ночная жизнь",
  local_food: "Локальная кухня",
};

interface Props {
  user: User;
  myTelegramId: number;
  onBack: () => void;
  onMatch: () => void;
}

export default function ProfileScreen({ user, myTelegramId, onBack, onMatch }: Props) {
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getUserRatings(user.telegram_id)
      .then((data) => {
        if (data.average) {
          setAvgRating(data.average.overall);
        }
      })
      .catch(() => {});
  }, [user.telegram_id]);

  const handleMatch = async () => {
    setSending(true);
    try {
      await createMatch(myTelegramId, user.telegram_id);
      onMatch();
    } catch (err) {
      console.error("Ошибка:", err);
    }
    setSending(false);
  };

  return (
    <div className="screen">
      {/* Большая аватарка */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: user.role === "local" ? "#F43F5E" : "#4ADE80",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 56,
            margin: "0 auto 16px",
          }}
        >
          {user.role === "local" ? "🏠" : "✈️"}
        </div>

        <h1 className="screen-title">{user.name}</h1>
        <p className="screen-subtitle" style={{ marginBottom: 8 }}>
          {user.role === "local" ? "Местный житель" : "Турист"}
          {user.country ? ` · ${user.country}` : ""}
        </p>

        {avgRating !== null && (
          <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.2)",
            borderRadius: 50,
            padding: "6px 16px",
            fontSize: 15,
            fontWeight: 700,
          }}>
            ⭐ {avgRating} / 10
          </div>
        )}
      </div>

      {/* Интересы */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
        {user.interests.map((i) => (
          <span key={i} className="interest-chip selected" style={{ cursor: "default" }}>
            {INTEREST_LABELS[i] || i}
          </span>
        ))}
      </div>

      {user.distance_km !== undefined && (
        <p className="screen-subtitle">📍 {user.distance_km} км от тебя</p>
      )}

      {/* Кнопка Погнали! */}
      <button
        className="btn-primary"
        onClick={handleMatch}
        disabled={sending}
        style={{ fontSize: 22 }}
      >
        {sending ? "Отправляем..." : "Погнали! 🚀"}
      </button>
    </div>
  );
}
