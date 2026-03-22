import { useState } from "react";

// Популярные страны для путешественников
const COUNTRIES = [
  "Россия", "Турция", "Таиланд", "Грузия", "Сербия", "Черногория",
  "Индонезия", "Вьетнам", "Испания", "Италия", "Франция", "Германия",
  "Япония", "Южная Корея", "Мексика", "Бразилия", "Аргентина",
  "ОАЭ", "Египет", "Марокко", "Португалия", "Греция", "Хорватия",
];

interface Props {
  onNext: (name: string, country: string) => void;
}

export default function OnboardingName({ onNext }: Props) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  const canProceed = name.trim().length >= 2 && country.length > 0;

  return (
    <div className="screen">
      <div className="logo">
        {/* SVG логотип MeetMates — два смайлика */}
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="40" r="24" fill="white" fillOpacity="0.9"/>
          <circle cx="50" cy="40" r="24" fill="white" fillOpacity="0.9"/>
          <circle cx="23" cy="35" r="3" fill="#C084FC"/>
          <circle cx="37" cy="35" r="3" fill="#C084FC"/>
          <circle cx="43" cy="35" r="3" fill="#C084FC"/>
          <circle cx="57" cy="35" r="3" fill="#C084FC"/>
          <path d="M20 45 Q30 52 37 45" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M43 45 Q50 52 57 45" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>
      </div>

      <h1 className="screen-title">Привет!</h1>
      <p className="screen-subtitle">Расскажи немного о себе</p>

      <input
        className="input-field"
        type="text"
        placeholder="Как тебя зовут?"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={30}
      />

      <select
        className="select-field"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      >
        <option value="">Выбери страну</option>
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <button
        className="btn-primary"
        disabled={!canProceed}
        onClick={() => onNext(name.trim(), country)}
      >
        Далее
      </button>
    </div>
  );
}
