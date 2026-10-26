import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import { useMood } from "../context/MoodContext";

export default function Session() {
  const { mood, config } = useMood();
  const [minutes, setMinutes] = useState(config.study);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [topic, setTopic] = useState("Current topic");
  const [message, setMessage] = useState("");
  const interval = useRef(null);

  useEffect(() => { setMinutes(config.study); setSeconds(0); setRunning(false); }, [config.study]);

  useEffect(() => {
    if (!running) return;
    interval.current = setInterval(() => {
      setSeconds(s => {
        if (s > 0) return s - 1;
        setMinutes(m => {
          if (m > 0) return m - 1;
          finish();
          return 0;
        });
        return 59;
      });
    }, 1000);
    return () => clearInterval(interval.current);
  }, [running]);

  async function finish() {
    setRunning(false); clearInterval(interval.current);
    try {
      await api("/study/sessions", { method:"POST", body:JSON.stringify({ subject:"Study", topic, mood, duration:config.study, type:"study" }) });
      setMessage("Session complete. Take the recommended break before your next block.");
    } catch (e) { setMessage(e.message); }
  }

  function reset() { setRunning(false); setMinutes(config.study); setSeconds(0); setMessage(""); }
  const total = config.study * 60;
  const left = minutes * 60 + seconds;
  const pct = Math.round(((total - left) / total) * 100);

  return (
    <div>
      <div className="page-title"><div><span className="eyebrow">Smart Pomodoro</span><h1>Protect your focus.</h1><p>The timer is automatically configured by your current study state.</p></div></div>
      <div className="timer-layout">
        <div className="card timer-card">
          <div className="timer-state">{config.emoji} {config.label} mode</div>
          <div className="timer-ring" style={{"--progress":`${pct * 3.6}deg`}}><div><strong>{String(minutes).padStart(2,"0")}:{String(seconds).padStart(2,"0")}</strong><small>{running ? "in focus" : "ready"}</small></div></div>
          <div className="timer-controls"><button className="btn" onClick={()=>setRunning(!running)}>{running ? "Pause" : "Start"}</button><button className="btn ghost" onClick={reset}>Reset</button></div>
          <label>Current topic<input value={topic} onChange={e=>setTopic(e.target.value)} /></label>
          {message && <div className="success-box">{message}</div>}
        </div>
        <div className="card">
          <span className="eyebrow">Adaptive settings</span><h2>{config.emoji} {config.label}</h2>
          <div className="settings-list"><div><span>Focus block</span><b>{config.study} minutes</b></div><div><span>Break</span><b>{config.break} minutes</b></div><div><span>Approach</span><b>{mood === "focused" ? "Deep practice" : mood === "exam" ? "High-value revision" : "Guided study"}</b></div></div>
          <div className="music-box"><span>♫</span><div><strong>Optional study music</strong><small>{mood === "stressed" ? "Calming ambient" : mood === "sleepy" ? "Light instrumental" : mood === "focused" ? "Deep-focus instrumental" : "Minimal-distraction study"}</small></div></div>
          <p className="muted">Music is intentionally not autoplayed. Add a YouTube/Spotify embed in this area if you want a legal external player.</p>
        </div>
      </div>
    </div>
  );
}
