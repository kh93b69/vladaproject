import { useState } from "react";

const INTERESTS = [
  { id: "bars", label: "Бары", emoji: "🍸" },
  { id: "clubs", label: "Клубы", emoji: "🎶" },
  { id: "walks", label: "Прогулки по городу", emoji: "🚶" },
  { id: "food", label: "Еда", emoji: "🍜" },
  { id: "nature", label: "Природа", emoji: "🏔" },
  { id: "art", label: "Искусство", emoji: "🎨" },
  { id: "sport", label: "Спорт", emoji: "⚽" },
  { id: "shopping", label: "Шопинг", emoji: "🛍" },
  { id: "history", label: "История", emoji: "🏛" },
  { id: "nightlife", label: "Ночная жизнь", emoji: "🌙" },
  { id: "local_food", label: "Местная кухня", emoji: "🥘" },
  { id: "trips", label: "Поездки загород", emoji: "🚗" },
  { id: "new_things", label: "Хочу попробовать что-то новое", emoji: "✨" },
];

interface Props {
  onNext: (interests: string[]) => void;
}

export default function OnboardingInterests({ onNext }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Что тебе интересно?</h1>
      <p className="screen-subtitle">Выбери хотя бы одно</p>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
        {INTERESTS.map((interest) => (
          <div
            key={interest.id}
            className={`interest-chip ${selected.includes(interest.id) ? "selected" : ""}`}
            onClick={() => toggle(interest.id)}
          >
            {interest.emoji} {interest.label}
          </div>
        ))}
      </div>

      <button
        className="btn-primary"
        disabled={selected.length === 0}
        onClick={() => onNext(selected)}
      >
        Готово
      </button>
    </div>
  );
}
