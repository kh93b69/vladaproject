import { useState, useEffect } from "react";
import "./styles/global.css";
import OnboardingName from "./components/OnboardingName";
import OnboardingRole from "./components/OnboardingRole";
import OnboardingInterests from "./components/OnboardingInterests";
import MapScreen from "./components/MapScreen";
import ProfileScreen from "./components/ProfileScreen";
import RatingScreen from "./components/RatingScreen";
import { createUser, getUser } from "./api";

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

const AVATARS = ["green-hat", "purple-viking", "red-bun", "lavender-beret", "pink-sombrero"];

function getRandomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

function getTelegramId(): number {
  try {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      return tg.initDataUnsafe.user.id;
    }
  } catch {}
  return 123456789;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [telegramId] = useState(getTelegramId);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
      }
    } catch {}

    getUser(telegramId)
      .then(() => setScreen("map"))
      .catch(() => setScreen("onboarding-name"));
  }, [telegramId]);

  // Навигация назад
  const goBack = () => {
    switch (screen) {
      case "onboarding-role":
        setScreen("onboarding-name");
        break;
      case "onboarding-interests":
        setScreen("onboarding-role");
        break;
      case "profile":
        setScreen("map");
        break;
      case "rating":
        setScreen("profile");
        break;
      default:
        break;
    }
  };

  // Сброс — начать заново
  const restart = () => {
    setName("");
    setCountry("");
    setRole("");
    setSelectedUser(null);
    setScreen("onboarding-name");
  };

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

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setScreen("profile");
  };

  const handleMatch = () => {
    setScreen("rating");
  };

  const handleRatingDone = () => {
    setSelectedUser(null);
    setScreen("map");
  };

  // Кнопка "Назад" — показывается на всех экранах кроме загрузки и первого
  const showBack = !["loading", "onboarding-name", "map"].includes(screen);

  return (
    <>
      {/* Верхняя панель навигации */}
      {screen !== "loading" && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px 0",
          maxWidth: 480,
          margin: "0 auto",
          width: "100%",
        }}>
          {showBack ? (
            <button onClick={goBack} style={{
              background: "none", border: "none", color: "white",
              fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Nunito",
            }}>
              ← Назад
            </button>
          ) : <div />}

          {screen === "map" && (
            <button onClick={restart} style={{
              background: "rgba(255,255,255,0.2)", border: "none", color: "white",
              fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Nunito",
              padding: "6px 14px", borderRadius: 50,
            }}>
              Сначала
            </button>
          )}
        </div>
      )}

      {screen === "loading" && (
        <div className="screen"><div className="loading">Загрузка...</div></div>
      )}
      {screen === "onboarding-name" && <OnboardingName onNext={handleName} />}
      {screen === "onboarding-role" && <OnboardingRole onNext={handleRole} />}
      {screen === "onboarding-interests" && <OnboardingInterests onNext={handleInterests} />}
      {screen === "map" && <MapScreen telegramId={telegramId} onSelectUser={handleSelectUser} />}
      {screen === "profile" && (
        <ProfileScreen
          user={selectedUser}
          myTelegramId={telegramId}
          onMatch={handleMatch}
        />
      )}
      {screen === "rating" && (
        <RatingScreen
          mate={selectedUser}
          myTelegramId={telegramId}
          onDone={handleRatingDone}
        />
      )}
    </>
  );
}
