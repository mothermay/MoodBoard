import { useState } from "react";
import { api } from "../services/api";
import { useMood } from "../context/MoodContext";
import MoodSelector from "../components/MoodSelector";
import PlanTimeline from "../components/PlanTimeline";

export default function Planner() {
  const { mood, config } = useMood();
  const [form, setForm] = useState({
    subject: "DBMS", topics: "Normalization\nTransactions\nSerializability\nQuery Optimization",
    examDate: "", availableMinutes: 120, difficulty: "medium"
  });
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function generate(e) {
    e.preventDefault(); setBusy(true); setError(""); setPlan(null);
    try {
      const data = await api("/ai/study-plan", { method:"POST", body:JSON.stringify({...form, mood}) });
      setPlan(data.plan);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  return (
    <div>
      <div className="page-title"><div><span className="eyebrow">Adaptive planner</span><h1>Turn your time into a plan.</h1><p>Gemini sees the whole context, while your mood controls the learning behavior.</p></div></div>
      <div className="two-col">
        <form className="card form-card" onSubmit={generate}>
          <div className="form-section"><label>Subject<input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} /></label><label>Topics / syllabus<textarea rows="6" value={form.topics} onChange={e=>setForm({...form,topics:e.target.value})} /></label></div>
          <div className="form-grid"><label>Exam date<input type="date" value={form.examDate} onChange={e=>setForm({...form,examDate:e.target.value})} /></label><label>Available minutes<input type="number" min="15" max="720" value={form.availableMinutes} onChange={e=>setForm({...form,availableMinutes:e.target.value})} /></label></div>
          <label>Difficulty preference<select value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})}><option>easy</option><option>medium</option><option>hard</option></select></label>
          <div><span className="field-label">Current mood</span><MoodSelector compact /></div>
          {error && <div className="error-box">{error}</div>}
          <button className="btn full" disabled={busy}>{busy ? "Building with Gemini…" : "Generate AI Study Plan"}</button>
        </form>
        <div className="card plan-card">
          {!plan ? <div className="empty-state"><span className="empty-icon">{config.emoji}</span><h2>Your adaptive plan appears here</h2><p>For <b>{config.label}</b>, MoodBoard targets {config.study}-minute focus blocks and {config.break}-minute breaks.</p></div> :
          <><div className="plan-header"><div><span className="eyebrow">Gemini strategy</span><h2>{plan.message}</h2></div><span className={`priority ${plan.priority}`}>{plan.priority}</span></div><div className="technique"><span>Recommended technique</span><b>{plan.recommendedTechnique}</b></div><PlanTimeline plan={plan} /></>}
        </div>
      </div>
    </div>
  );
}
