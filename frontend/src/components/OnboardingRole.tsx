interface Props {
  onNext: (role: "local" | "tourist") => void;
}

export default function OnboardingRole({ onNext }: Props) {
  return (
    <div className="screen animate-fade-in" style={{ justifyContent: "center" }}>
      <h1 className="screen-title" style={{ marginBottom: 32 }}>Кто ты?</h1>

      <div style={{ display: "flex", gap: 16 }}>
        <div className="role-card" onClick={() => onNext("local")}>
          <div className="role-card-icon">
            <svg viewBox="0 0 100 100" width="70" height="70">
              <circle cx="50" cy="50" r="42" fill="#F43F5E"/>
              <circle cx="38" cy="44" r="5" fill="white"/>
              <circle cx="62" cy="44" r="5" fill="white"/>
              <circle cx="38" cy="44" r="2.5" fill="#1E1B4B"/>
              <circle cx="62" cy="44" r="2.5" fill="#1E1B4B"/>
              <path d="M38 60 Q50 70 62 60" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <div className="role-card-title">Местный</div>
          <div className="role-card-desc">
            Хочу изучить новые места в своём городе вместе с кем-то
          </div>
        </div>

        <div className="role-card" onClick={() => onNext("tourist")}>
          <div className="role-card-icon">
            <svg viewBox="0 0 100 100" width="70" height="70">
              <circle cx="50" cy="50" r="42" fill="#4ADE80"/>
              <circle cx="38" cy="44" r="5" fill="white"/>
              <circle cx="62" cy="44" r="5" fill="white"/>
              <circle cx="38" cy="44" r="2.5" fill="#1E1B4B"/>
              <circle cx="62" cy="44" r="2.5" fill="#1E1B4B"/>
              <path d="M38 60 Q50 70 62 60" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <div className="role-card-title">Турист</div>
          <div className="role-card-desc">
            Приехал в новый город и хочу найти спутника для прогулок
          </div>
        </div>
      </div>
    </div>
  );
}
