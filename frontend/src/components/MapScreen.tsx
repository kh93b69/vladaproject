import { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import { getNearbyUsers, updateUser } from "../api";

interface User {
  telegram_id: number;
  name: string;
  role: string;
  interests: string[];
  avatar: string;
  latitude: number;
  longitude: number;
  distance_km?: number;
  description?: string;
  avg_rating?: number;
  gender?: string;
}

interface Props {
  telegramId: number;
  onSelectUser: (user: User) => void;
  cityCoords?: { lat: number; lng: number } | null;
  cityName?: string;
}

export default function MapScreen({ telegramId, onSelectUser, cityCoords, cityName }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async (lat: number, lng: number) => {
      try {
        await updateUser(telegramId, { latitude: lat, longitude: lng });
        const nearby = await getNearbyUsers(telegramId);
        setUsers(nearby);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      }
      setLoading(false);
    };

    // Используем координаты города если есть, иначе геолокацию
    if (cityCoords) {
      loadUsers(cityCoords.lat, cityCoords.lng);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadUsers(pos.coords.latitude, pos.coords.longitude),
        () => loadUsers(55.7558, 37.6173)
      );
    } else {
      loadUsers(55.7558, 37.6173);
    }
  }, [telegramId, cityCoords]);

  if (loading) {
    return (
      <div className="screen">
        <div className="loading">
          <div className="loading-spinner" />
          Ищем спутника рядом...
        </div>
      </div>
    );
  }

  return (
    <div className="screen animate-fade-in" style={{ padding: "16px 16px" }}>
      <h1 className="screen-title" style={{ fontSize: 22, marginBottom: 4 }}>
        Люди рядом
      </h1>
      {cityName && (
        <p className="screen-subtitle" style={{ marginBottom: 16 }}>{cityName}</p>
      )}

      {/* Стилизованная карта */}
      <div style={{
        borderRadius: 20,
        overflow: "hidden",
        height: 200,
        marginBottom: 20,
        background: "linear-gradient(135deg, #C4B5FD 0%, #818CF8 50%, #A78BFA 100%)",
        position: "relative",
        border: "1px solid rgba(255,255,255,0.2)",
      }}>
        {/* Декоративные линии */}
        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, opacity: 0.3 }}>
          <path d="M0 70 Q100 50 200 80 Q320 110 420 60" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M0 130 Q80 110 180 140 Q300 170 420 120" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M70 0 Q80 70 60 140 Q50 190 70 250" stroke="white" strokeWidth="1" fill="none"/>
          <path d="M260 0 Q250 60 270 130 Q280 190 260 250" stroke="white" strokeWidth="1" fill="none"/>
        </svg>

        {/* Центр — "Ты здесь" */}
        <div style={{
          position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)",
          display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2,
        }}>
          <div style={{
            width: 14, height: 14, borderRadius: "50%",
            background: "white", border: "3px solid #7C3AED",
            boxShadow: "0 0 0 4px rgba(124,58,237,0.3)",
          }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: "white", marginTop: 3 }}>
            Ты здесь
          </span>
        </div>

        {/* Маркеры-флажки */}
        {users.slice(0, 5).map((u, i) => {
          const positions = [
            { top: "22%", left: "22%" },
            { top: "28%", left: "78%" },
            { top: "68%", left: "18%" },
            { top: "62%", left: "72%" },
            { top: "18%", left: "52%" },
          ];
          const pos = positions[i];
          return (
            <div
              key={u.telegram_id}
              onClick={() => onSelectUser(u)}
              style={{ position: "absolute", ...pos, cursor: "pointer", zIndex: 1 }}
            >
              <svg width="20" height="26" viewBox="0 0 20 26">
                <path d="M10 25 L10 8" stroke="white" strokeWidth="2"/>
                <circle cx="10" cy="7" r="6" fill="white" stroke="rgba(124,58,237,0.5)" strokeWidth="1.5"/>
                <circle cx="10" cy="7" r="3" fill="#7C3AED"/>
              </svg>
            </div>
          );
        })}
      </div>

      {users.length === 0 ? (
        <p className="screen-subtitle">Пока никого не нашли рядом</p>
      ) : (
        users.map((u) => (
          <ProfileCard key={u.telegram_id} user={u} onClick={() => onSelectUser(u)} />
        ))
      )}
    </div>
  );
}
