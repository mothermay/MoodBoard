import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useMood } from "../context/MoodContext";

export default function Flashcards() {
  const { mood } = useMood();
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  const [busy, setBusy] = useState(false);
  const [topic, setTopic] = useState("Operating Systems");

  async function generate() {
    setBusy(true);
    try {
      const data = await api("/ai/flashcards", { method:"POST", body:JSON.stringify({ subject:topic, mood, count:10, noteId:null }) });
      setCards(data.cards || []);
      setIndex(0); setFlip(false);
    } catch (e) { alert(e.message); } finally { setBusy(false); }
  }

  const card = cards[index];
  return <div><div className="page-title"><div><span className="eyebrow">Active recall</span><h1>Build memory with flashcards.</h1><p>Generate from a topic or use the Notes page to generate cards from uploaded material.</p></div></div>
    <div className="card flash-toolbar"><label>Topic<input value={topic} onChange={e=>setTopic(e.target.value)} /></label><button className="btn" onClick={generate} disabled={busy}>{busy?"Generating…":"Generate with Gemini"}</button></div>
    {card ? <div className="flash-stage"><button className={`flash-card ${flip?"flipped":""}`} onClick={()=>setFlip(!flip)}><span className="flash-label">{flip?"BACK":"FRONT"} · {index+1}/{cards.length}</span><strong>{flip ? card.back : card.front}</strong><small>Tap to flip</small></button><div className="flash-actions"><button onClick={()=>setIndex(Math.max(0,index-1))}>← Previous</button><button className="btn" onClick={()=>{setFlip(false);setIndex((index+1)%cards.length)}}>Next →</button><button onClick={()=>setIndex((index+1)%cards.length)}>Mark difficult</button></div></div> : <div className="empty-state card"><span className="empty-icon">◇</span><h2>No cards yet</h2><p>Generate a set to start reviewing.</p></div>}
  </div>;
}
