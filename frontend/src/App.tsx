import { useState, useEffect } from "react";
import "./styles/global.css";
import OnboardingName from "./components/OnboardingName";
import OnboardingRole from "./components/OnboardingRole";
import OnboardingInterests from "./components/OnboardingInterests";
import MapScreen from "./components/MapScreen";
import ProfileScreen from "./components/ProfileScreen";
import RatingScreen from "./components/RatingScreen";
import { createUser, getUser } from "./api";

// Типы экранов
type Screen =
  | "loading"
  | "onboarding-name"
  | "onboarding-role"
  | "onboarding-interests"
  | "map"
  | "profile"
  | "rating";

interface UserData {
  telegram_id: number;
  name: string;
  country: string;
  role: string;
  interests: string[];
  avatar: string;
}

// Список аватарок blob-персонажей
const AVATARS = ["green-hat", "purple-viking", "red-bun", "lavender-beret", "pink-sombrero"];

function getRandomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

// Получаем telegram_id из Telegram WebApp или используем тестовый
function getTelegramId(): number {
  try {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      return tg.initDataUnsafe.user.id;
    }
  } catch {
    // Если не в Telegram — используем тестовый ID
  }
  return 123456789; // Тестовый ID для разработки
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [telegramId] = useState(getTelegramId);

  // Данные онбординга (собираем пошагово)
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // При загрузке проверяем, есть ли уже пользователь
  useEffect(() => {
    // Инициализация Telegram WebApp
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
      }
    } catch {
      // Не в Telegram
    }

    // Проверяем, есть ли пользователь в базе
    getUser(telegramId)
      .then(() => {
        // Пользователь уже зарегистрирован — сразу на карту
        setScreen("map");
      })
      .catch(() => {
        // Новый пользователь — начинаем онбординг
        setScreen("onboarding-name");
      });
  }, [telegramId]);

  // Обработчики шагов онбординга
  const handleName = (n: string, c: string) => {
    setName(n);
    setCountry(c);
    setScreen("onboarding-role");
  };

  const handleRole = (r: "local" | "tourist") => {
    setRole(r);
    setScreen("onboarding-interests");
  };

  const handleInterests = async (interests: string[]) => {
    const userData: UserData = {
      telegram_id: telegramId,
      name,
      country,
      role,
      interests,
      avatar: getRandomAvatar(),
    };

    try {
      await createUser(userData);
      setScreen("map");
    } catch (err) {
      console.error("Ошибка регистрации:", err);
      alert("Ошибка регистрации. Попробуй ещё раз.");
    }
  };

  // Выбор пользователя из списка
  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setScreen("profile");
  };

  // После нажатия "Погнали!" — переходим к оценке
  const handleMatch = () => {
    setScreen("rating");
  };

  // После отправки оценки — возвращаемся на карту
  const handleRatingDone = () => {
    setSelectedUser(null);
    setScreen("map");
  };

  // Рендерим текущий экран
  switch (screen) {
    case "loading":
      return (
        <div className="screen">
          <div className="loading">Загрузка...</div>
        </div>
      );

    case "onboarding-name":
      return <OnboardingName onNext={handleName} />;

    case "onboarding-role":
      return <OnboardingRole onNext={handleRole} />;

    case "onboarding-interests":
      return <OnboardingInterests onNext={handleInterests} />;

    case "map":
      return <MapScreen telegramId={telegramId} onSelectUser={handleSelectUser} />;

    case "profile":
      return (
        <ProfileScreen
          user={selectedUser}
          myTelegramId={telegramId}
          onBack={() => setScreen("map")}
          onMatch={handleMatch}
        />
      );

    case "rating":
      return (
        <RatingScreen
          mate={selectedUser}
          myTelegramId={telegramId}
          onDone={handleRatingDone}
        />
      );

    default:
      return null;
  }
}
