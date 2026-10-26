import { useState } from "react";
import { api } from "../services/api";
import { useMood } from "../context/MoodContext";

export default function Quiz() {
  const { mood } = useMood();
  const [setup, setSetup] = useState({ subject:"Operating Systems", topic:"Process Scheduling", difficulty:"medium", count:10 });
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  async function generate() {
    setBusy(true); setResult(null);
    try { setQuiz(await api("/ai/quiz",{method:"POST",body:JSON.stringify({...setup,mood})})); setAnswers({}); }
    catch(e){alert(e.message)} finally{setBusy(false)}
  }

  async function submit() {
    const questions = quiz.questions;
    let score=0; const weak=[];
    questions.forEach((q,i)=>{ if(Number(answers[i])===q.correctIndex) score++; else if(q.topic) weak.push(q.topic); });
    const data = await api("/quiz/results",{method:"POST",body:JSON.stringify({subject:setup.subject,topic:setup.topic,mood,score,total:questions.length,answers,weakTopics:[...new Set(weak)]})});
    setResult({score,total:questions.length,percentage:data.result.percentage,weakTopics:data.result.weakTopics});
  }

  return <div><div className="page-title"><div><span className="eyebrow">Adaptive practice</span><h1>Test what you actually know.</h1><p>Question difficulty responds to your mood and your chosen level.</p></div></div>
    {!quiz ? <div className="card form-card quiz-setup"><div className="form-grid"><label>Subject<input value={setup.subject} onChange={e=>setSetup({...setup,subject:e.target.value})}/></label><label>Topic<input value={setup.topic} onChange={e=>setSetup({...setup,topic:e.target.value})}/></label></div><div className="form-grid"><label>Difficulty<select value={setup.difficulty} onChange={e=>setSetup({...setup,difficulty:e.target.value})}><option>easy</option><option>medium</option><option>hard</option></select></label><label>Questions<select value={setup.count} onChange={e=>setSetup({...setup,count:e.target.value})}><option>5</option><option>10</option><option>15</option></select></label></div><button className="btn" onClick={generate} disabled={busy}>{busy?"Generating…":"Generate quiz"}</button></div> :
    <div className="quiz-wrap"><div className="card"><div className="quiz-head"><span className="pill">{mood} mode</span><span>{quiz.questions.length} questions</span></div>{quiz.questions.map((q,i)=><div className="question" key={i}><span className="question-num">{i+1}</span><div><h3>{q.question}</h3><div className="options">{q.options.map((o,j)=><label key={j} className={answers[i]===j?"chosen":""}><input type="radio" name={`q${i}`} checked={answers[i]===j} onChange={()=>setAnswers({...answers,[i]:j})}/>{o}</label>)}</div></div></div>)}<button className="btn full" onClick={submit}>Submit quiz</button></div>
    {result && <div className="card result-card"><span className="eyebrow">Saved result</span><strong>{result.percentage}%</strong><p>{result.score} / {result.total} correct.</p>{result.weakTopics?.length>0 && <><h3>Revise next</h3><p>{result.weakTopics.join(", ")}</p></>}<button className="btn ghost" onClick={()=>setQuiz(null)}>New quiz</button></div>}</div>}
  </div>;
}
