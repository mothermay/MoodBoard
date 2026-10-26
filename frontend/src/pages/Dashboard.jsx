import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useMood } from "../context/MoodContext";
import MoodSelector from "../components/MoodSelector";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const { user } = useAuth();
  const { config, mood } = useMood();
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { api("/progress").then(setProgress).catch(e => setError(e.message)); }, []);

  const total = progress?.stats?.totalStudyMinutes || 0;
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <div className="page-title"><div><span className="eyebrow">{greeting}</span><h1>{user?.name}’s study board</h1><p>Your current state is <b>{config.emoji} {config.label}</b>, so today’s experience is tuned around it.</p></div><Link to="/planner" className="btn">Generate AI plan →</Link></div>
      {error && <div className="error-box">{error}</div>}

      <section className="dashboard-hero">
        <div><span className="eyebrow">Current adaptive mode</span><h2>{config.emoji} {config.label}</h2><p>{config.description}. Your focus blocks are <b>{config.study} minutes</b> with <b>{config.break} minute</b> breaks.</p><Link className="text-link" to="/session">Start a session →</Link></div>
        <div className="hero-progress"><div className="ring"><span>{Math.min(100, Math.round((total % 60) / 60 * 100))}%</span></div><small>Today’s momentum</small></div>
      </section>

      <div className="stat-grid">
        <StatCard label="Study time" value={`${total}m`} hint="All time" icon="◷" />
        <StatCard label="Current streak" value={`${progress?.stats?.currentStreak || 0} days`} hint={`Best ${progress?.stats?.longestStreak || 0}`} icon="🔥" />
        <StatCard label="Quiz average" value={`${progress?.averageQuiz || 0}%`} hint={`${progress?.totalSessions || 0} sessions`} icon="✓" />
        <StatCard label="Topics completed" value={progress?.topicCompletion || 0} hint="Recorded sessions" icon="◆" />
      </div>

      <section className="card-section">
        <div className="section-row"><div><span className="eyebrow">Change the experience</span><h2>How are you feeling right now?</h2></div><span className="pill">{mood}</span></div>
        <MoodSelector compact />
      </section>

      <section className="quick-grid">
        <Link to="/session" className="quick-card"><span>◷</span><strong>Start study session</strong><small>Use the mood-configured timer</small></Link>
        <Link to="/notes" className="quick-card"><span>▤</span><strong>Upload notes</strong><small>Summarize and practice from them</small></Link>
        <Link to="/quiz" className="quick-card"><span>?</span><strong>Generate quiz</strong><small>Difficulty adapts to your state</small></Link>
      </section>
    </div>
  );
}
