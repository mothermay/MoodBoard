import { Link } from "react-router-dom";
import { moods } from "../context/MoodContext";

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="brand"><span className="brand-mark">M</span>MoodBoard</div>
        <div><Link to="/login" className="text-link">Login</Link><Link to="/register" className="btn small">Start studying</Link></div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">AI-powered adaptive study</span>
          <h1>Study according to <span>your state.</span></h1>
          <p>MoodBoard turns your mood, subject, syllabus, exam date and available time into a study experience that actually adapts.</p>
          <div className="hero-actions"><Link to="/register" className="btn">Build my study plan →</Link><a href="#how" className="btn ghost">See how it works</a></div>
          <div className="trust-row"><span>✓ Real Gemini AI</span><span>✓ Local-first data</span><span>✓ Responsive</span></div>
        </div>
        <div className="hero-card">
          <div className="mini-top"><span>Today’s adaptive plan</span><span className="live">● LIVE</span></div>
          <div className="hero-mood">🚨 <div><strong>Exam Tomorrow</strong><small>High-value revision mode</small></div></div>
          <div className="mini-plan"><div><b>25</b><span>min</span></div><p>Operating Systems<br/><strong>Process scheduling</strong></p><span>→</span></div>
          <div className="mini-plan break"><div><b>5</b><span>min</span></div><p>Recovery break<br/><strong>Reset + breathe</strong></p><span>☕</span></div>
          <div className="mini-plan"><div><b>20</b><span>Q</span></div><p>Exam-style practice<br/><strong>Prioritize weak topics</strong></p><span>→</span></div>
        </div>
      </section>

      <section className="mood-strip">
        {Object.entries(moods).map(([key, m]) => <div key={key}><span>{m.emoji}</span><strong>{m.label}</strong><small>{m.description}</small></div>)}
      </section>

      <section id="how" className="section">
        <div className="section-head"><span className="eyebrow">One coherent flow</span><h2>From how you feel to what you should do next.</h2></div>
        <div className="feature-grid">
          {[
            ["01","Set your state","Choose a mood, subject, syllabus, exam date and time available."],
            ["02","Let AI adapt","Gemini turns that context into a structured, actionable strategy."],
            ["03","Learn + measure","Study, review notes, practice quizzes and see what to revise next."]
          ].map(x => <div className="feature-card" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></div>)}
        </div>
      </section>

      <section className="ai-banner"><div><span className="eyebrow">Not just a theme</span><h2>Your mood changes the learning behavior.</h2><p>Session length, breaks, content density, question difficulty and recommendation style all respond to your selected state.</p></div><Link to="/register" className="btn">Try MoodBoard</Link></section>
      <footer>© {new Date().getFullYear()} MoodBoard · Built for focused learning.</footer>
    </div>
  );
}
