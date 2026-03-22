interface User {
  telegram_id: number;
  name: string;
  role: string;
  interests: string[];
  avatar: string;
  distance_km?: number;
}

// Маппинг интересов на русские названия
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

// Цвета аватарок blob-персонажей
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
  const interestLabels = user.interests
    .map((i) => INTEREST_LABELS[i] || i)
    .slice(0, 3)
    .join(", ");

  return (
    <div className="profile-card" onClick={onClick}>
      {/* Круглая аватарка blob-персонажа */}
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
        <div className="profile-interests">{interestLabels}</div>
      </div>

      {user.distance_km !== undefined && (
        <div className="profile-distance">{user.distance_km} км</div>
      )}
    </div>
  );
}
