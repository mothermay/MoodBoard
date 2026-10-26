import { useMood, moods } from "../context/MoodContext";

export default function MoodSelector({ compact = false }) {
  const { mood, setMood } = useMood();
  return (
    <div className={`mood-grid ${compact ? "compact" : ""}`}>
      {Object.entries(moods).map(([key, m]) => (
        <button key={key} className={`mood-card ${mood === key ? "selected" : ""}`} onClick={() => setMood(key)}>
          <span className="mood-emoji">{m.emoji}</span>
          <span><strong>{m.label}</strong><small>{m.description}</small></span>
          {!compact && <em>{m.study}m focus · {m.break}m break</em>}
        </button>
      ))}
    </div>
  );
}
