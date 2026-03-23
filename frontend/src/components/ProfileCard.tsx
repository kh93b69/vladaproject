interface User {
  telegram_id: number;
  name: string;
  role: string;
  interests: string[];
  avatar: string;
  distance_km?: number;
  description?: string;
  avg_rating?: number;
  gender?: string;
}

interface Props {
  user: User;
  onClick?: () => void;
}

// Фото по полу через randomuser.me (seed = telegram_id для стабильности)
function getPhotoUrl(user: User, size = 100): string {
  const gender = user.gender === "male" ? "men" : "women";
  // Стабильный индекс от telegram_id (0-99)
  const idx = Math.abs(user.telegram_id) % 100;
  return `https://randomuser.me/api/portraits/${gender}/${idx}.jpg`;
}

export default function ProfileCard({ user, onClick }: Props) {
  const photoUrl = getPhotoUrl(user);

  return (
    <div className="profile-card" onClick={onClick}>
      <img
        className="profile-avatar"
        src={photoUrl}
        alt={user.name}
        style={{ objectFit: "cover" }}
      />

      <div className="profile-info">
        <div className="profile-name">{user.name}</div>
        {user.description && (
          <div className="profile-desc">{user.description}</div>
        )}
        {user.avg_rating !== undefined && user.avg_rating > 0 && (
          <div className="profile-stars">
            {"★".repeat(Math.round(user.avg_rating / 2))}{"☆".repeat(5 - Math.round(user.avg_rating / 2))}
            {" "}{user.avg_rating.toFixed(1)}
          </div>
        )}
      </div>

      {user.distance_km !== undefined && (
        <div className="profile-distance">{user.distance_km} км</div>
      )}
    </div>
  );
}
