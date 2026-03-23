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
      {/* Лого — два blob-персонажа MeetMates */}
      <div style={{ width: 120, height: 80, margin: "0 auto 16px", position: "relative" }}>
        {/* Левый персонаж (розовый) */}
        <svg viewBox="0 0 60 60" width="60" height="60" style={{ position: "absolute", left: 0, top: 10 }}>
          <circle cx="30" cy="30" r="28" fill="#F43F5E"/>
          <circle cx="22" cy="26" r="4" fill="white"/>
          <circle cx="38" cy="26" r="4" fill="white"/>
          <circle cx="22" cy="26" r="2" fill="#1E1B4B"/>
          <circle cx="38" cy="26" r="2" fill="#1E1B4B"/>
          <path d="M20 36 Q30 44 40 36" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>
        {/* Правый персонаж (зелёный) */}
        <svg viewBox="0 0 60 60" width="60" height="60" style={{ position: "absolute", right: 0, top: 10 }}>
          <circle cx="30" cy="30" r="28" fill="#4ADE80"/>
          <circle cx="22" cy="26" r="4" fill="white"/>
          <circle cx="38" cy="26" r="4" fill="white"/>
          <circle cx="22" cy="26" r="2" fill="#1E1B4B"/>
          <circle cx="38" cy="26" r="2" fill="#1E1B4B"/>
          <path d="M20 36 Q30 44 40 36" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
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
