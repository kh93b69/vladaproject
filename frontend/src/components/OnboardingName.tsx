import { useState } from "react";

const COUNTRIES = [
  "Россия", "Турция", "Таиланд", "Грузия", "Сербия", "Черногория",
  "Индонезия", "Вьетнам", "Испания", "Италия", "Франция", "Германия",
  "Япония", "Южная Корея", "Мексика", "Бразилия", "Аргентина",
  "ОАЭ", "Египет", "Марокко", "Португалия", "Греция", "Хорватия",
];

interface Props {
  onNext: (name: string, country: string, age: string, city: string) => void;
}

export default function OnboardingName({ onNext }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const canProceed = name.trim().length >= 2 && age.length > 0 && country.length > 0 && city.trim().length >= 2;

  return (
    <div className="screen">
      {/* Лого */}
      <div className="logo">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="40" r="24" fill="white" fillOpacity="0.9"/>
          <circle cx="50" cy="40" r="24" fill="white" fillOpacity="0.9"/>
          <circle cx="23" cy="35" r="3" fill="#7C3AED"/>
          <circle cx="37" cy="35" r="3" fill="#7C3AED"/>
          <circle cx="43" cy="35" r="3" fill="#7C3AED"/>
          <circle cx="57" cy="35" r="3" fill="#7C3AED"/>
          <path d="M20 45 Q30 52 37 45" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M43 45 Q50 52 57 45" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>
      </div>

      <h1 className="screen-title">Привет!</h1>
      <p className="screen-subtitle">
        Мы рады видеть тебя в нашей семье MeetMates
      </p>

      <input
        className="input-field"
        type="text"
        placeholder="Как тебя зовут?"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={30}
      />

      <input
        className="input-field"
        type="number"
        placeholder="Сколько тебе лет?"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        min={14}
        max={99}
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

      <input
        className="input-field"
        type="text"
        placeholder="Выбери город"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        maxLength={50}
      />

      <button
        className="btn-primary"
        disabled={!canProceed}
        onClick={() => onNext(name.trim(), country, age, city.trim())}
      >
        Далее
      </button>
    </div>
  );
}
