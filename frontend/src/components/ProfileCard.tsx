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

const AVATAR_COLORS: Record<string, string> = {
  "green-hat": "#4ADE80",
  "purple-viking": "#8B5CF6",
  "red-bun": "#F43F5E",
  "lavender-beret": "#A78BFA",
  "pink-sombrero": "#EC4899",
};

interface Props {
  user: User;
  onClick?: () => void;
}

export default function ProfileCard({ user, onClick }: Props) {
  const bgColor = AVATAR_COLORS[user.avatar] || "#C084FC";

  return (
    <div className="profile-card" onClick={onClick}>
      <div
        className="profile-avatar"
        style={{
          backgroundColor: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          fontSize: 24,
        }}
      >
        {user.role === "local" ? "🏠" : "✈️"}
      </div>

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
