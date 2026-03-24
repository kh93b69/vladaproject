import { useState } from "react";

// Страны и их города с координатами
const COUNTRY_CITIES: Record<string, { name: string; lat: number; lng: number }[]> = {
  "Россия": [
    { name: "Москва", lat: 55.7558, lng: 37.6173 },
    { name: "Санкт-Петербург", lat: 59.9343, lng: 30.3351 },
    { name: "Сочи", lat: 43.5855, lng: 39.7231 },
    { name: "Казань", lat: 55.7887, lng: 49.1221 },
    { name: "Екатеринбург", lat: 56.8389, lng: 60.6057 },
    { name: "Новосибирск", lat: 55.0084, lng: 82.9357 },
    { name: "Калининград", lat: 54.7104, lng: 20.4522 },
  ],
  "Казахстан": [
    { name: "Астана", lat: 51.1694, lng: 71.4491 },
    { name: "Алматы", lat: 43.2220, lng: 76.8512 },
    { name: "Шымкент", lat: 42.3417, lng: 69.5901 },
    { name: "Караганда", lat: 49.8047, lng: 73.1094 },
    { name: "Актау", lat: 43.6353, lng: 51.1691 },
  ],
  "Турция": [
    { name: "Стамбул", lat: 41.0082, lng: 28.9784 },
    { name: "Анталья", lat: 36.8969, lng: 30.7133 },
    { name: "Анкара", lat: 39.9334, lng: 32.8597 },
    { name: "Бодрум", lat: 37.0344, lng: 27.4305 },
    { name: "Измир", lat: 38.4237, lng: 27.1428 },
  ],
  "Таиланд": [
    { name: "Бангкок", lat: 13.7563, lng: 100.5018 },
    { name: "Пхукет", lat: 7.8804, lng: 98.3923 },
    { name: "Паттайя", lat: 12.9236, lng: 100.8825 },
    { name: "Чиангмай", lat: 18.7883, lng: 98.9853 },
  ],
  "Грузия": [
    { name: "Тбилиси", lat: 41.7151, lng: 44.8271 },
    { name: "Батуми", lat: 41.6168, lng: 41.6367 },
  ],
  "Сербия": [
    { name: "Белград", lat: 44.7866, lng: 20.4489 },
    { name: "Нови-Сад", lat: 45.2671, lng: 19.8335 },
  ],
  "Черногория": [
    { name: "Подгорица", lat: 42.4304, lng: 19.2594 },
    { name: "Будва", lat: 42.2914, lng: 18.8401 },
    { name: "Тиват", lat: 42.4275, lng: 18.6961 },
  ],
  "Индонезия": [
    { name: "Бали", lat: -8.3405, lng: 115.0920 },
    { name: "Джакарта", lat: -6.2088, lng: 106.8456 },
  ],
  "Вьетнам": [
    { name: "Ханой", lat: 21.0278, lng: 105.8342 },
    { name: "Хошимин", lat: 10.8231, lng: 106.6297 },
    { name: "Нячанг", lat: 12.2388, lng: 109.1967 },
  ],
  "Испания": [
    { name: "Барселона", lat: 41.3874, lng: 2.1686 },
    { name: "Мадрид", lat: 40.4168, lng: -3.7038 },
    { name: "Валенсия", lat: 39.4699, lng: -0.3763 },
  ],
  "Италия": [
    { name: "Рим", lat: 41.9028, lng: 12.4964 },
    { name: "Милан", lat: 45.4642, lng: 9.1900 },
    { name: "Флоренция", lat: 43.7696, lng: 11.2558 },
  ],
  "Франция": [
    { name: "Париж", lat: 48.8566, lng: 2.3522 },
    { name: "Ницца", lat: 43.7102, lng: 7.2620 },
    { name: "Лион", lat: 45.7640, lng: 4.8357 },
  ],
  "Германия": [
    { name: "Берлин", lat: 52.5200, lng: 13.4050 },
    { name: "Мюнхен", lat: 48.1351, lng: 11.5820 },
  ],
  "Япония": [
    { name: "Токио", lat: 35.6762, lng: 139.6503 },
    { name: "Осака", lat: 34.6937, lng: 135.5023 },
  ],
  "Южная Корея": [
    { name: "Сеул", lat: 37.5665, lng: 126.9780 },
    { name: "Пусан", lat: 35.1796, lng: 129.0756 },
  ],
  "Мексика": [
    { name: "Мехико", lat: 19.4326, lng: -99.1332 },
    { name: "Канкун", lat: 21.1619, lng: -86.8515 },
  ],
  "Бразилия": [
    { name: "Рио-де-Жанейро", lat: -22.9068, lng: -43.1729 },
    { name: "Сан-Паулу", lat: -23.5505, lng: -46.6333 },
  ],
  "Аргентина": [
    { name: "Буэнос-Айрес", lat: -34.6037, lng: -58.3816 },
  ],
  "ОАЭ": [
    { name: "Дубай", lat: 25.2048, lng: 55.2708 },
    { name: "Абу-Даби", lat: 24.4539, lng: 54.3773 },
  ],
  "Египет": [
    { name: "Каир", lat: 30.0444, lng: 31.2357 },
    { name: "Хургада", lat: 27.2579, lng: 33.8116 },
    { name: "Шарм-эль-Шейх", lat: 27.9158, lng: 34.3300 },
  ],
  "Марокко": [
    { name: "Марракеш", lat: 31.6295, lng: -7.9811 },
    { name: "Касабланка", lat: 33.5731, lng: -7.5898 },
  ],
  "Португалия": [
    { name: "Лиссабон", lat: 38.7223, lng: -9.1393 },
    { name: "Порту", lat: 41.1579, lng: -8.6291 },
  ],
  "Греция": [
    { name: "Афины", lat: 37.9838, lng: 23.7275 },
    { name: "Салоники", lat: 40.6401, lng: 22.9444 },
  ],
  "Хорватия": [
    { name: "Загреб", lat: 45.8150, lng: 15.9819 },
    { name: "Дубровник", lat: 42.6507, lng: 18.0944 },
    { name: "Сплит", lat: 43.5081, lng: 16.4402 },
  ],
};

const COUNTRIES = Object.keys(COUNTRY_CITIES);

interface Props {
  onNext: (name: string, country: string, age: string, city: string, lat: number, lng: number) => void;
}

export default function OnboardingName({ onNext }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const cities = country ? COUNTRY_CITIES[country] || [] : [];
  const selectedCity = cities.find((c) => c.name === city);

  const canProceed = name.trim().length >= 2 && age.length > 0 && country.length > 0 && city.length > 0;

  const handleSubmit = () => {
    if (!selectedCity) return;
    onNext(name.trim(), country, age, city, selectedCity.lat, selectedCity.lng);
  };

  return (
    <div className="screen animate-fade-in">
      {/* Лого MeetMates */}
      <div style={{ width: 140, height: 90, margin: "0 auto 16px" }}>
        <svg viewBox="0 0 140 80" width="140" height="80">
          <circle cx="45" cy="40" r="32" fill="white"/>
          <circle cx="95" cy="40" r="32" fill="white"/>
          <circle cx="33" cy="35" r="4" fill="#9F9DFF"/>
          <circle cx="50" cy="32" r="4" fill="#9F9DFF"/>
          <path d="M30 48 Q42 58 54 48" stroke="#9F9DFF" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          <circle cx="90" cy="32" r="4" fill="#9F9DFF"/>
          <circle cx="107" cy="35" r="4" fill="#9F9DFF"/>
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
        onChange={(e) => { setCountry(e.target.value); setCity(""); }}
      >
        <option value="">Выбери страну</option>
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        className="select-field"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={!country}
      >
        <option value="">Выбери город</option>
        {cities.map((c) => (
          <option key={c.name} value={c.name}>{c.name}</option>
        ))}
      </select>

      <button
        className="btn-primary"
        disabled={!canProceed}
        onClick={handleSubmit}
      >
        Далее
      </button>
    </div>
  );
}
