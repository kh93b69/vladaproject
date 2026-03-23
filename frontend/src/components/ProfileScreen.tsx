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
  description?: string;
  avg_rating?: number;
  gender?: string;
}

const INTEREST_LABELS: Record<string, string> = {
  bars: "Бары",
  clubs: "Клубы",
  walks: "Прогулки по городу",
  food: "Еда",
  nature: "Природа",
  art: "Искусство",
  sport: "Спорт",
  shopping: "Шопинг",
  history: "История",
  nightlife: "Ночная жизнь",
  local_food: "Местная кухня",
  trips: "Поездки загород",
  new_things: "Что-то новое",
};

interface RatingData {
  safety: number;
  experience: number;
  communication: number;
  overall: number;
}

interface Props {
  user: User;
  myTelegramId: number;
  onMatch: () => void;
}

export default function ProfileScreen({ user, myTelegramId, onMatch }: Props) {
  const [ratings, setRatings] = useState<RatingData | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getUserRatings(user.telegram_id)
      .then((data) => {
        if (data.average) {
          setRatings(data.average);
        }
      })
      .catch(() => {});
  }, [user.telegram_id]);

  const handleMatch = async () => {
    setSending(true);
    try {
      // Фейковые юзеры (telegram_id >= 900000) не существуют в БД — пропускаем API
      if (user.telegram_id < 900000) {
        await createMatch(myTelegramId, user.telegram_id);
      }
      onMatch();
    } catch (err) {
      console.error("Ошибка:", err);
      // Даже при ошибке переходим дальше
      onMatch();
    }
    setSending(false);
  };

  return (
    <div className="screen">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <img
          src={`https://randomuser.me/api/portraits/${user.gender === "male" ? "men" : "women"}/${Math.abs(user.telegram_id) % 100}.jpg`}
          alt={user.name}
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            objectFit: "cover",
            margin: "0 auto 16px",
            display: "block",
            border: "3px solid rgba(255,255,255,0.3)",
          }}
        />

        <h1 className="screen-title">{user.name}</h1>
        <p className="screen-subtitle" style={{ marginBottom: 8 }}>
          {user.role === "local" ? "Местный житель" : "Турист"}
          {user.country ? ` · ${user.country}` : ""}
        </p>

        {user.description && (
          <p style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.7)",
            fontWeight: 600,
            marginBottom: 16,
            fontStyle: "italic",
          }}>
            "{user.description}"
          </p>
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

      {/* Звёзды рейтинга */}
      {!ratings && user.avg_rating !== undefined && user.avg_rating > 0 && (
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 20, color: "#FBBF24" }}>
            {"★".repeat(Math.round(user.avg_rating / 2))}{"☆".repeat(5 - Math.round(user.avg_rating / 2))}
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, marginLeft: 8 }}>
            {user.avg_rating.toFixed(1)} / 10
          </span>
        </div>
      )}

      {/* Детальные оценки */}
      {ratings && (
        <div style={{
          background: "rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>
            Оценки от других пользователей
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <RatingRow label="Безопасность" value={ratings.safety} />
            <RatingRow label="Общение" value={ratings.communication} />
            <RatingRow label="Времяпрепровождение" value={ratings.experience} />
          </div>
          <div style={{
            marginTop: 12,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 900,
          }}>
            Общая: {ratings.overall.toFixed(1)} / 10
          </div>
        </div>
      )}

      {user.distance_km !== undefined && (
        <p className="screen-subtitle">📍 {user.distance_km} км от тебя</p>
      )}

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

function RatingRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 100,
          height: 6,
          borderRadius: 3,
          background: "rgba(255,255,255,0.15)",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${value * 10}%`,
            height: "100%",
            borderRadius: 3,
            background: value >= 7 ? "#4ADE80" : value >= 4 ? "#FB923C" : "#F43F5E",
          }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 800, minWidth: 35, textAlign: "right" }}>
          {value}/10
        </span>
      </div>
    </div>
  );
}
