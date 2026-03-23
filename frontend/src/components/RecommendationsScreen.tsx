const RECOMMENDATIONS = [
  {
    title: "Секретный бар на крыше",
    desc: "Мало кто знает, но на крыше старого здания в центре есть уютный бар с потрясающим видом на город. Спросите у местных!",
  },
  {
    title: "Утренний рынок",
    desc: "Каждое воскресенье с 7 утра работает фермерский рынок. Свежие фрукты, домашний сыр и живая музыка.",
  },
  {
    title: "Парк у реки",
    desc: "Тихое место для прогулок, где можно встретить местных художников и музыкантов. Особенно красиво на закате.",
  },
  {
    title: "Кофейня в переулке",
    desc: "Небольшая кофейня, которую держит семейная пара. Лучший кофе в городе и домашние десерты.",
  },
];

export default function RecommendationsScreen() {
  return (
    <div className="screen">
      <h1 className="screen-title">Рекомендации</h1>
      <p className="screen-subtitle">
        Эксклюзивные места от команды MeetMates
      </p>

      {RECOMMENDATIONS.map((rec, i) => (
        <div key={i} className="rec-card">
          <div className="rec-card-title">{rec.title}</div>
          <div className="rec-card-desc">{rec.desc}</div>
        </div>
      ))}
    </div>
  );
}
