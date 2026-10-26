import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function MoodHistory() {
  const [items,setItems]=useState([]);
  useEffect(()=>{api("/moods").then(d=>setItems(d.moods)).catch(()=>{})},[]);
  return <div><div className="page-title"><div><span className="eyebrow">Patterns over time</span><h1>Mood history.</h1><p>These are study-state inputs, not medical or psychological diagnoses.</p></div></div>
    <div className="card table-card"><div className="table-head"><span>Date</span><span>Mood</span><span>Subject</span><span>Study</span><span>Performance</span></div>{items.length?items.map(x=><div className="table-row" key={x._id}><span>{new Date(x.createdAt).toLocaleString()}</span><span>{x.mood}</span><span>{x.subject||"—"}</span><span>{x.studyDuration||0}m</span><span>{x.performance?`${x.performance}%`:"—"}</span></div>):<div className="empty-state"><p>No mood selections recorded yet.</p></div>}</div>
  </div>;
}
