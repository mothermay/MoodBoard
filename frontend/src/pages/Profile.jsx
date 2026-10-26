import { useAuth } from "../context/AuthContext";
import MoodSelector from "../components/MoodSelector";

export default function Profile() {
  const { user } = useAuth();
  return <div><div className="page-title"><div><span className="eyebrow">Settings</span><h1>Your profile.</h1><p>Keep your study preferences simple and local.</p></div></div>
    <div className="two-col"><div className="card form-card"><label>Name<input value={user?.name||""} readOnly/></label><label>Email<input value={user?.email||""} readOnly/></label><label>Daily goal<input value={`${user?.studyPreferences?.dailyGoal||60} minutes`} readOnly/></label><div className="security-note">🔒 Passwords are hashed. Gemini credentials never reach the browser.</div></div><div className="card"><span className="eyebrow">Default experience</span><h2>Choose a current state</h2><MoodSelector/><p className="muted">Changing this immediately changes timer settings and the AI context used on the next generation request.</p></div></div>
  </div>;
}
