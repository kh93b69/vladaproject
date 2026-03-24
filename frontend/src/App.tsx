import { useState, useEffect } from "react";
import "./styles/global.css";
import OnboardingName from "./components/OnboardingName";
import OnboardingRole from "./components/OnboardingRole";
import OnboardingInterests from "./components/OnboardingInterests";
import MapScreen from "./components/MapScreen";
import ProfileScreen from "./components/ProfileScreen";
import RatingScreen from "./components/RatingScreen";
import RecommendationsScreen from "./components/RecommendationsScreen";
import { createUser, getUser } from "./api";

type Screen =
  | "loading"
  | "onboarding-name"
  | "onboarding-role"
  | "onboarding-interests"
  | "map"
  | "profile"
  | "rating"
  | "recommendations"
  | "thankyou";

interface UserData {
  telegram_id: number;
  name: string;
  country: string;
  city: string;
  age: string;
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
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [cityCoords, setCityCoords] = useState<{ lat: number; lng: number } | null>(null);
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
      case "recommendations":
        setScreen("map");
        break;
      default:
        break;
    }
  };

  const restart = () => {
    setName("");
    setCountry("");
    setAge("");
    setCity("");
    setCityCoords(null);
    setRole("");
    setSelectedUser(null);
    setScreen("onboarding-name");
  };

  const handleName = (n: string, c: string, a: string, ci: string, lat: number, lng: number) => {
    setName(n);
    setCountry(c);
    setAge(a);
    setCity(ci);
    setCityCoords({ lat, lng });
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
      city,
      age,
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
    setScreen("thankyou");
  };

  const showBack = !["loading", "onboarding-name", "map", "thankyou"].includes(screen);

  return (
    <>
      {screen !== "loading" && screen !== "thankyou" && (
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

          <div style={{ display: "flex", gap: 8 }}>
            {screen === "map" && (
              <>
                <button onClick={() => setScreen("recommendations")} style={{
                  background: "rgba(255,255,255,0.3)", border: "none", color: "white",
                  fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Nunito",
                  padding: "6px 14px", borderRadius: 50,
                }}>
                  Рекомендации
                </button>
                <button onClick={restart} style={{
                  background: "rgba(255,255,255,0.3)", border: "none", color: "white",
                  fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Nunito",
                  padding: "6px 14px", borderRadius: 50,
                }}>
                  Сначала
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {screen === "loading" && (
        <div className="screen">
          <div className="loading">
            <div className="loading-spinner" />
            Загрузка...
          </div>
        </div>
      )}
      {screen === "onboarding-name" && <OnboardingName onNext={handleName} />}
      {screen === "onboarding-role" && <OnboardingRole onNext={handleRole} />}
      {screen === "onboarding-interests" && <OnboardingInterests onNext={handleInterests} />}
      {screen === "map" && (
        <MapScreen
          telegramId={telegramId}
          onSelectUser={handleSelectUser}
          cityCoords={cityCoords}
          cityName={city}
        />
      )}
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
      {screen === "recommendations" && <RecommendationsScreen />}
      {screen === "thankyou" && (
        <div className="screen animate-fade-in" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: 140, height: 80, margin: "0 auto 24px" }}>
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
          <h1 className="screen-title" style={{ marginBottom: 12 }}>Спасибо!</h1>
          <p className="screen-subtitle" style={{ marginBottom: 32 }}>
            Спасибо, что использовали MeetMates
          </p>
          <button className="btn-primary" onClick={restart}>
            Начать сначала
          </button>
        </div>
      )}
    </>
  );
}
