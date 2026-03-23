import { useState } from "react";
import { createRating } from "../api";

interface User {
  telegram_id: number;
  name: string;
}

interface Props {
  mate: User;
  myTelegramId: number;
  onDone: () => void;
}

export default function RatingScreen({ mate, myTelegramId, onDone }: Props) {
  const [safety, setSafety] = useState(7);
  const [experience, setExperience] = useState(7);
  const [communication, setCommunication] = useState(7);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    setSending(true);
    try {
      // Фейковые юзеры (telegram_id >= 900000) не в БД — пропускаем
      if (mate.telegram_id < 900000) {
        await createRating({
          from_telegram_id: myTelegramId,
          to_telegram_id: mate.telegram_id,
          safety,
          experience,
          communication,
        });
      }
      onDone();
    } catch (err) {
      console.error("Ошибка:", err);
      onDone();
    }
    setSending(false);
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Оцени спутника</h1>
      <p className="screen-subtitle">Как прошла встреча с {mate.name}?</p>

      <div style={{ flex: 1 }}>
        <div className="rating-category">
          <div className="rating-label">🛡 Безопасность</div>
          <input
            type="range"
            min={1}
            max={10}
            value={safety}
            onChange={(e) => setSafety(Number(e.target.value))}
            className="rating-slider"
          />
          <div className="rating-value">{safety}</div>
        </div>

        <div className="rating-category">
          <div className="rating-label">🎯 Времяпрепровождение</div>
          <input
            type="range"
            min={1}
            max={10}
            value={experience}
            onChange={(e) => setExperience(Number(e.target.value))}
            className="rating-slider"
          />
          <div className="rating-value">{experience}</div>
        </div>

        <div className="rating-category">
          <div className="rating-label">💬 Общение</div>
          <input
            type="range"
            min={1}
            max={10}
            value={communication}
            onChange={(e) => setCommunication(Number(e.target.value))}
            className="rating-slider"
          />
          <div className="rating-value">{communication}</div>
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={sending}
      >
        {sending ? "Отправляем..." : "Отправить оценку"}
      </button>
    </div>
  );
}
