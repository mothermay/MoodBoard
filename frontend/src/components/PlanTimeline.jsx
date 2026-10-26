export default function PlanTimeline({ plan }) {
  if (!plan?.sessions?.length) return null;
  return (
    <div className="timeline">
      {plan.sessions.map((s, i) => (
        <div className={`timeline-item ${s.type}`} key={i}>
          <div className="timeline-dot">{s.type === "break" ? "☕" : s.type === "quiz" ? "?" : s.type === "mock" ? "⏱" : "✓"}</div>
          <div className="timeline-body">
            <div className="row-between"><strong>{s.topic || "Study block"}</strong><span>{s.duration} min</span></div>
            <p>{s.activity}</p>
            <small>{s.type}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
