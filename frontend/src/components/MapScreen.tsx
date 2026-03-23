import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ProfileCard from "./ProfileCard";
import { getNearbyUsers, updateUser } from "../api";

// Цвета blob-персонажей (обычные hex для inline HTML)
const AVATAR_COLORS: Record<string, string> = {
  "green-hat": "#4ADE80",
  "purple-viking": "#8B5CF6",
  "red-bun": "#F43F5E",
  "lavender-beret": "#A78BFA",
  "pink-sombrero": "#EC4899",
};

// SVG blob-маркер (цветной кружок с глазками и улыбкой)
function blobIcon(avatar: string, isMe = false): L.DivIcon {
  const color = AVATAR_COLORS[avatar] || "#C084FC";
  const size = isMe ? 48 : 40;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="${color}" stroke="white" stroke-width="4"/>
      <circle cx="38" cy="42" r="5" fill="white"/>
      <circle cx="62" cy="42" r="5" fill="white"/>
      <circle cx="38" cy="42" r="2.5" fill="#1E1B4B"/>
      <circle cx="62" cy="42" r="2.5" fill="#1E1B4B"/>
      <path d="M36 58 Q50 68 64 58" stroke="white" stroke-width="3" stroke-linecap="round" fill="none"/>
    </svg>`;

  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">${svg}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    className: "",
  });
}

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

      <div className="map-container">
        <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://osm.org">OSM</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={blobIcon("green-hat", true)}>
            <Popup>Ты здесь</Popup>
          </Marker>
          {users.map((u) => (
            <Marker
              key={u.telegram_id}
              position={[u.latitude, u.longitude]}
              icon={blobIcon(u.avatar)}
              eventHandlers={{ click: () => onSelectUser(u) }}
            >
              <Popup>{u.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
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
