import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ProfileCard from "./ProfileCard";
import { getNearbyUsers, updateUser } from "../api";

// Фикс иконки маркера для Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface User {
  telegram_id: number;
  name: string;
  role: string;
  interests: string[];
  avatar: string;
  latitude: number;
  longitude: number;
  distance_km?: number;
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
    // Получаем геолокацию
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition([lat, lng]);

          // Обновляем координаты пользователя на сервере
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
          // Если геолокация недоступна — ставим Москву по умолчанию
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
        <div className="loading">Ищем людей рядом...</div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ padding: "16px 16px" }}>
      <h1 className="screen-title" style={{ fontSize: 22, marginBottom: 16 }}>
        Люди рядом
      </h1>

      <div className="map-container">
        <MapContainer center={position} zoom={12} scrollWheelZoom={false}>
          <TileLayer
            attribution=""
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {/* Маркер текущего пользователя */}
          <Marker position={position}>
            <Popup>Ты здесь</Popup>
          </Marker>
          {/* Маркеры других пользователей */}
          {users.map((u) => (
            <Marker key={u.telegram_id} position={[u.latitude, u.longitude]}>
              <Popup>{u.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Список карточек */}
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
