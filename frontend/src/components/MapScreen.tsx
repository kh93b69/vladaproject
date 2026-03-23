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
}

export default function MapScreen({ telegramId, onSelectUser }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition([lat, lng]);

          try {
            await updateUser(telegramId, { latitude: lat, longitude: lng });
            const nearby = await getNearbyUsers(telegramId);
            setUsers(nearby);
          } catch (err) {
            console.error("Ошибка загрузки:", err);
          }
          setLoading(false);
        },
        () => {
          setPosition([55.7558, 37.6173]);
          setLoading(false);
        }
      );
    } else {
      setPosition([55.7558, 37.6173]);
      setLoading(false);
    }
  }, [telegramId]);

  if (loading || !position) {
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
    <div className="screen" style={{ padding: "16px 16px" }}>
      <h1 className="screen-title" style={{ fontSize: 22, marginBottom: 16 }}>
        Люди рядом
      </h1>

      {/* Стилизованная карта */}
      <div style={{
        borderRadius: 20,
        overflow: "hidden",
        height: 220,
        marginBottom: 20,
        background: "linear-gradient(135deg, #C4B5FD 0%, #818CF8 50%, #A78BFA 100%)",
        position: "relative",
        border: "1px solid rgba(255,255,255,0.2)",
      }}>
        {/* Декоративные линии-дороги */}
        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
          <path d="M0 80 Q120 60 200 90 Q300 120 400 70" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none"/>
          <path d="M0 140 Q100 120 180 150 Q280 180 400 130" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none"/>
          <path d="M80 0 Q90 80 70 150 Q60 200 80 260" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
          <path d="M250 0 Q240 70 260 140 Q270 200 250 260" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
        </svg>

        {/* Метка "Ты здесь" */}
        <div style={{
          position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <div style={{
            width: 16, height: 16, borderRadius: "50%",
            background: "white", border: "3px solid #7C3AED",
            boxShadow: "0 0 0 4px rgba(124,58,237,0.3)",
          }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "white", marginTop: 4, textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
            Ты здесь
          </span>
        </div>

        {/* Маркеры-точки для гидов */}
        {users.slice(0, 5).map((u, i) => {
          const positions = [
            { top: "20%", left: "25%" },
            { top: "30%", left: "75%" },
            { top: "65%", left: "20%" },
            { top: "60%", left: "70%" },
            { top: "15%", left: "55%" },
          ];
          const pos = positions[i];
          return (
            <div
              key={u.telegram_id}
              onClick={() => onSelectUser(u)}
              style={{
                position: "absolute", ...pos,
                cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center",
              }}
            >
              <div style={{
                width: 12, height: 12, borderRadius: "50%",
                background: "white",
                border: "2px solid rgba(255,255,255,0.8)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }} />
              <span style={{
                fontSize: 10, fontWeight: 700, color: "white",
                marginTop: 2, textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}>
                {u.name.split(" ")[0]}
              </span>
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
