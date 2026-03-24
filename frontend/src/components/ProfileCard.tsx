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
  photo_id?: number;
}

interface Props {
  user: User;
  onClick?: () => void;
}

function getPhotoUrl(user: User): string {
  const gender = user.gender === "male" ? "men" : "women";
  const id = user.photo_id ?? (Math.abs(user.telegram_id) % 100);
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
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
