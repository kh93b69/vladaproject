interface Props {
  onNext: (role: "local" | "tourist") => void;
}

export default function OnboardingRole({ onNext }: Props) {
  return (
    <div className="screen">
      <h1 className="screen-title">Кто ты?</h1>
      <p className="screen-subtitle">Выбери свою роль</p>

      <div style={{ display: "flex", gap: 16, flex: 1, alignItems: "center" }}>
        <div className="role-card" onClick={() => onNext("local")}>
          <div className="role-card-icon">
            {/* Blob-персонаж: местный (розовый с сомбреро) */}
            <svg viewBox="0 0 100 100" width="80" height="80">
              <circle cx="50" cy="55" r="35" fill="#F43F5E"/>
              {/* Сомбреро */}
              <ellipse cx="50" cy="25" rx="30" ry="8" fill="#FBBF24"/>
              <ellipse cx="50" cy="22" rx="18" ry="12" fill="#FBBF24"/>
              <path d="M35 22 Q50 8 65 22" fill="#FB923C"/>
              <path d="M32 27 L38 25 L44 28 L50 25 L56 28 L62 25 L68 27" stroke="#4ADE80" strokeWidth="2.5" fill="none"/>
              {/* Глазки */}
              <path d="M38 52 Q42 48 46 52" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M54 52 Q58 48 62 52" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              {/* Улыбка */}
              <path d="M40 62 Q50 70 60 62" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <div className="role-card-title">Местный</div>
          <div className="role-card-desc">Покажи туристам крутые места</div>
        </div>

        <div className="role-card" onClick={() => onNext("tourist")}>
          <div className="role-card-icon">
            {/* Blob-персонаж: турист (зелёный со шляпой) */}
            <svg viewBox="0 0 100 100" width="80" height="80">
              <path d="M25 65 Q25 30 50 30 Q75 30 75 65 Q75 85 50 85 Q25 85 25 65Z" fill="#4ADE80"/>
              {/* Шляпа */}
              <ellipse cx="50" cy="30" rx="32" ry="8" fill="white"/>
              <ellipse cx="50" cy="26" rx="22" ry="14" fill="white"/>
              <rect x="35" y="25" width="30" height="4" rx="2" fill="#1E1B4B"/>
              {/* Глазки */}
              <circle cx="40" cy="52" r="3" fill="#1E1B4B"/>
              <circle cx="60" cy="52" r="3" fill="#1E1B4B"/>
              {/* Улыбка */}
              <path d="M42 62 Q50 68 58 62" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <div className="role-card-title">Турист</div>
          <div className="role-card-desc">Найди местного гида</div>
        </div>
      </div>
    </div>
  );
}
