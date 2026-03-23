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
      {/* Лого MeetMates — два белых пересекающихся круга с лицами */}
      <div style={{ width: 140, height: 90, margin: "0 auto 16px" }}>
        <svg viewBox="0 0 140 80" width="140" height="80">
          {/* Два белых пересекающихся круга */}
          <circle cx="45" cy="40" r="32" fill="white"/>
          <circle cx="95" cy="40" r="32" fill="white"/>
          {/* Левое лицо — глаза (фиолетовые = цвет фона) */}
          <circle cx="33" cy="35" r="4" fill="#9F9DFF"/>
          <circle cx="50" cy="32" r="4" fill="#9F9DFF"/>
          {/* Левая улыбка */}
          <path d="M30 48 Q42 58 54 48" stroke="#9F9DFF" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          {/* Правое лицо — глаза */}
          <circle cx="90" cy="32" r="4" fill="#9F9DFF"/>
          <circle cx="107" cy="35" r="4" fill="#9F9DFF"/>
          {/* Правая улыбка */}
          <path d="M86 48 Q98 58 110 48" stroke="#9F9DFF" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
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
