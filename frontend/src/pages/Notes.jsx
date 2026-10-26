import { useEffect, useState } from "react";
import { api, upload } from "../services/api";
import { useMood } from "../context/MoodContext";

export default function Notes() {
  const { mood } = useMood();
  const [notes, setNotes] = useState([]);
  const [file, setFile] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [cards, setCards] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() { try { setNotes((await api("/notes")).notes); } catch(e){setError(e.message)} }
  useEffect(() => { load(); }, []);

  async function handleUpload(e) {
    e.preventDefault(); if (!file) return;
    setBusy(true); setError("");
    try {
      const fd = new FormData(); fd.append("file", file);
      const data = await upload("/notes/upload", fd);
      setSelected(data.note); await load();
    } catch(e) { setError(e.message); } finally { setBusy(false); }
  }

  async function summarize() {
    if (!selected) return; setBusy(true); setError("");
    try { setResult((await api("/ai/summary",{method:"POST",body:JSON.stringify({noteId:selected.id || selected._id,subject:selected.originalName,mood})})).result); }
    catch(e){setError(e.message)} finally{setBusy(false)}
  }

  async function makeCards() {
    if (!selected) return; setBusy(true); setError("");
    try { setCards((await api("/ai/flashcards",{method:"POST",body:JSON.stringify({noteId:selected.id || selected._id,subject:selected.originalName,mood,count:10})})).cards); }
    catch(e){setError(e.message)} finally{setBusy(false)}
  }

  async function remove(id) { try { await api(`/notes/${id}`,{method:"DELETE"}); if(selected?.id===id || selected?._id===id) setSelected(null); load(); } catch(e){setError(e.message)} }

  return (
    <div>
      <div className="page-title"><div><span className="eyebrow">Study material</span><h1>Your notes, made useful.</h1><p>Upload local documents, extract their text, then use Gemini for adaptive learning.</p></div></div>
      <div className="two-col">
        <div>
          <form className="card upload-card" onSubmit={handleUpload}>
            <div className="dropzone"><span>↑</span><strong>Upload PDF, DOCX or PPTX</strong><small>Up to 10MB · stored locally</small><input type="file" accept=".pdf,.docx,.pptx" onChange={e=>setFile(e.target.files?.[0]||null)} /></div>
            {file && <div className="file-row"><span>▤</span>{file.name}<button type="button" onClick={()=>setFile(null)}>×</button></div>}
            {error && <div className="error-box">{error}</div>}
            <button className="btn full" disabled={busy || !file}>{busy ? "Processing…" : "Upload and extract text"}</button>
          </form>
          <div className="card">
            <div className="section-row"><h2>Uploaded material</h2><span className="pill">{notes.length} files</span></div>
            {notes.length === 0 ? <div className="empty-state compact-empty"><p>No notes yet.</p></div> : notes.map(n => <button className={`note-item ${selected && (selected.id===n._id || selected._id===n._id) ? "selected":""}`} key={n._id} onClick={()=>setSelected(n)}><span>▤</span><div><strong>{n.originalName}</strong><small>{Math.round(n.size/1024)} KB · {new Date(n.createdAt).toLocaleDateString()}</small></div><span>→</span></button>)}
          </div>
        </div>
        <div className="card note-workspace">
          {!selected ? <div className="empty-state"><span className="empty-icon">▤</span><h2>Select a note</h2><p>Then generate a mood-aware summary or flashcards.</p></div> :
          <><div className="section-row"><div><span className="eyebrow">Selected</span><h2>{selected.originalName}</h2></div><button className="danger-link" onClick={()=>remove(selected.id||selected._id)}>Delete</button></div>
          <div className="action-row"><button className="btn" onClick={summarize} disabled={busy}>✦ Summarize</button><button className="btn ghost" onClick={makeCards} disabled={busy}>◇ Flashcards</button></div>
          {result && <div className="ai-result"><span className="eyebrow">Adaptive summary · {mood}</span><p>{result.summary}</p>{["keyConcepts","definitions","formulas","examPoints","questions"].map(k=>result[k]?.length ? <div key={k}><h3>{k.replace(/([A-Z])/g," $1")}</h3><ul>{result[k].map((x,i)=><li key={i}>{x}</li>)}</ul></div>:null)}</div>}
          {cards && <div className="cards-preview"><span className="eyebrow">Generated flashcards</span>{cards.map((c,i)=><div className="flash-mini" key={i}><strong>{c.front}</strong><p>{c.back}</p></div>)}</div>}</>}
        </div>
      </div>
    </div>
  );
}
