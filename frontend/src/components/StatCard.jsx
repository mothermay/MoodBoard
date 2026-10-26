export default function StatCard({ label, value, hint, icon }) {
  return <div className="stat-card"><span className="stat-icon">{icon}</span><div><small>{label}</small><strong>{value}</strong>{hint && <em>{hint}</em>}</div></div>;
}
