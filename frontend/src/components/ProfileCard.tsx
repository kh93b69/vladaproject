interface User {
  telegram_id: number;
  name: string;
  role: string;
  interests: string[];
  avatar: string;
  distance_km?: number;
  description?: string;
  avg_rating?: number;
}

interface Props {
  user: User;
  onClick?: () => void;
}

export default function ProfileCard({ user, onClick }: Props) {
  // Рандомная фотка человека по telegram_id как seed
  const photoUrl = `https://i.pravatar.cc/100?u=${user.telegram_id}`;

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
