import { useEffect, useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { api } from "../services/api";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

export default function Progress() {
  const [data,setData]=useState(null);
  useEffect(()=>{api("/progress").then(setData).catch(()=>{})},[]);
  if(!data) return <div className="center-page"><div className="loader"/></div>;

  const weekly = data.weeklyStudy || [];
  const quizzes = data.quizPerformance || [];
  const moods = data.moodDistribution || {};
  return <div><div className="page-title"><div><span className="eyebrow">Progress</span><h1>See what your study is becoming.</h1><p>Sessions, quizzes and mood choices are connected in one view.</p></div></div>
    <div className="stat-grid"><div className="stat-card"><span className="stat-icon">◷</span><div><small>Total study</small><strong>{data.stats.totalStudyMinutes||0}m</strong></div></div><div className="stat-card"><span className="stat-icon">✓</span><div><small>Quiz average</small><strong>{data.averageQuiz}%</strong></div></div><div className="stat-card"><span className="stat-icon">🔥</span><div><small>Current streak</small><strong>{data.stats.currentStreak||0}</strong></div></div><div className="stat-card"><span className="stat-icon">◆</span><div><small>Sessions</small><strong>{data.totalSessions}</strong></div></div></div>
    <div className="chart-grid"><div className="card chart-card"><h2>Study time</h2><Line data={{labels:weekly.map(x=>new Date(x.date).toLocaleDateString(undefined,{weekday:"short"})),datasets:[{label:"Minutes",data:weekly.map(x=>x.minutes),tension:.35}]}} options={{responsive:true,maintainAspectRatio:false}}/></div><div className="card chart-card"><h2>Quiz performance</h2><Bar data={{labels:quizzes.map((x,i)=>`Quiz ${i+1}`),datasets:[{label:"Score %",data:quizzes.map(x=>x.percentage)}]}} options={{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,max:100}}}}/></div><div className="card chart-card small-chart"><h2>Mood distribution</h2><Doughnut data={{labels:Object.keys(moods),datasets:[{data:Object.values(moods)}]}} options={{responsive:true,maintainAspectRatio:false}}/></div></div>
  </div>;
}
