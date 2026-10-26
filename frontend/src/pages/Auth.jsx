import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth({ mode = "login" }) {
  const isRegister = mode === "register";
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand"><span className="brand-mark">M</span> MoodBoard</div>
      <div className="auth-card">
        <span className="eyebrow">{isRegister ? "Create your workspace" : "Welcome back"}</span>
        <h1>{isRegister ? "Build a study rhythm that fits you." : "Pick up where you left off."}</h1>
        <p>{isRegister ? "Your mood becomes a useful study input—not a diagnosis." : "Your plans, sessions and progress stay connected."}</p>
        <form onSubmit={submit}>
          {isRegister && <label>Name<input value={form.name} onChange={e => setForm({...form, name:e.target.value})} required /></label>}
          <label>Email<input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required /></label>
          <label>Password<input type="password" minLength="6" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required /></label>
          {error && <div className="error-box">{error}</div>}
          <button className="btn full" disabled={busy}>{busy ? "Working…" : isRegister ? "Create account" : "Log in"}</button>
        </form>
        <div className="auth-switch">{isRegister ? "Already have an account?" : "New to MoodBoard?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Log in" : "Create one"}</Link></div>
      </div>
    </div>
  );
}
