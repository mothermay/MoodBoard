import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMood } from "../context/MoodContext";

const links = [
  ["/dashboard", "⌂", "Dashboard"],
  ["/planner", "✦", "Planner"],
  ["/session", "◷", "Session"],
  ["/notes", "▤", "Notes"],
  ["/flashcards", "◇", "Cards"],
  ["/quiz", "?", "Quiz"],
  ["/progress", "↗", "Progress"],
  ["/moods", "◉", "Mood History"]
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { config } = useMood();
  const navigate = useNavigate();

  return (
    <div className={`app-shell mood-${config.label.toLowerCase().replaceAll(" ", "-")}`}>
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">M</span><span>MoodBoard</span></div>
        <div className="sidebar-mood">{config.emoji} {config.label}<small>{config.description}</small></div>
        <nav>
          {links.map(([to, icon, label]) => <NavLink key={to} to={to} className={({isActive}) => isActive ? "active" : ""}><b>{icon}</b>{label}</NavLink>)}
        </nav>
        <div className="sidebar-bottom">
          <NavLink to="/profile"><b>⚙</b>Profile</NavLink>
          <button className="logout" onClick={() => { logout(); navigate("/"); }}>↪ Log out</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">M</span>MoodBoard</div>
          <div className="top-user"><span>{config.emoji}</span><div><strong>{user?.name}</strong><small>Adaptive study mode</small></div></div>
        </header>
        <div className="page-content"><Outlet /></div>
        <nav className="mobile-nav">
          {links.slice(0, 5).map(([to, icon, label]) => <NavLink key={to} to={to}><b>{icon}</b><small>{label}</small></NavLink>)}
        </nav>
      </main>
    </div>
  );
}
