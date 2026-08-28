import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Coins, Flame, Plus, Timer } from "lucide-react";
import Navbar from "../components/Navbar";
import HourSlot from "../components/HourSlot";
import TaskModal from "../components/TaskModal";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

interface Task { id:string; title:string; status:string; startHour:number; durationHrs:number; difficulty:"SHORT"|"MEDIUM"|"DIFFICULT"; }
function potentialCoinsForHour(hour:number) { return (hour >= 4 && hour < 8) || hour >= 23 || hour < 3 ? 20 : 10; }

export default function Today() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks,setTasks] = useState<Task[]>([]);
  const [loading,setLoading] = useState(true);
  const [modalHour,setModalHour] = useState<number|null>(null);
  const [balance,setBalance] = useState(0);
  const [streak,setStreak] = useState(0);
  const [now,setNow] = useState(new Date());
  const today = useMemo(() => new Date().toISOString(), []);

  async function loadTasks() {
    setLoading(true);
    try {
      const [{ tasks:loaded }, wallet] = await Promise.all([api.get(`/api/tasks?date=${today}`), api.get("/api/wallet")]);
      setTasks(loaded); setBalance(wallet.balance); setStreak(wallet.streakDays);
    } finally { setLoading(false); }
  }
  useEffect(() => { loadTasks(); const timer=setInterval(()=>setNow(new Date()),30000); return()=>clearInterval(timer); }, []);

  async function handleCreate(data:{title:string;category:string;startHour:number;durationHrs:number;difficulty:"SHORT"|"MEDIUM"|"DIFFICULT"}) { await api.post("/api/tasks",{...data,date:today}); await loadTasks(); }
  async function handleComplete(taskId:string) { await api.post(`/api/tasks/${taskId}/complete`); await loadTasks(); }

  const tasksByHour = new Map(tasks.map(t=>[t.startHour,t]));
  const completed = tasks.filter(t=>t.status==="COMPLETED").length;
  const progress = tasks.length ? Math.round(completed/tasks.length*100) : 0;
  const nextTask = tasks.filter(t=>t.status!=="COMPLETED" && t.startHour>=now.getHours()).sort((a,b)=>a.startHour-b.startHour)[0];
  const displayName = user?.user_metadata?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";

  return (
    <div className="dashboard-shell">
      <div className="dashboard-aurora dashboard-aurora-one" aria-hidden="true" />
      <div className="dashboard-aurora dashboard-aurora-two" aria-hidden="true" />
      <div className="dashboard-grid-light" aria-hidden="true" />
      <Navbar />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div><span className="dashboard-eyebrow">{now.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})}</span><h1>Good {now.getHours()<12?"morning":now.getHours()<18?"afternoon":"evening"}, <em>{displayName}.</em></h1><p>Your hours are waiting. Give each one a purpose.</p></div>
          <div className="dashboard-live-time">
            <span className="live-clock-face" aria-hidden="true"><i/><b/><em/></span>
            <div><span>{now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span><small>YOUR LOCAL TIME</small></div>
          </div>
        </header>

        <section className="dashboard-stats">
          <article><span className="stat-icon gold"><Coins size={18}/></span><div><small>Available balance</small><strong>{balance}<i> coins</i></strong></div><ArrowUpRight size={16}/></article>
          <article><span className="stat-icon coral"><Flame size={18}/></span><div><small>Current streak</small><strong>{streak}<i> days</i></strong></div></article>
          <article><span className="stat-icon mint"><CheckCircle2 size={18}/></span><div><small>Today's progress</small><strong>{progress}<i>%</i></strong></div><span className="mini-progress"><b style={{width:`${progress}%`}}/></span></article>
        </section>

        <section className="dashboard-grid">
          <div className="day-panel">
            <div className="panel-heading"><div><span>YOUR 24 HOURS</span><h2>Today’s timeline</h2></div><button onClick={()=>setModalHour(now.getHours())}><Plus size={16}/> Add a task</button></div>
            {loading ? <div className="dashboard-loading">Building your day...</div> : <div className="timeline-list">{Array.from({length:24},(_,hour)=>{const task=tasksByHour.get(hour); return <div key={hour} className="timeline-wrap"><HourSlot hour={hour} task={task} current={hour===now.getHours()} potentialCoins={potentialCoinsForHour(hour)} onClick={()=>task ? task.status!=="COMPLETED"&&handleComplete(task.id) : setModalHour(hour)}/>{task&&task.status!=="COMPLETED"&&<button className="timeline-focus" onClick={()=>navigate("/focus",{state:{taskId:task.id,title:task.title}})}><Timer size={13}/> Focus</button>}</div>})}</div>}
          </div>

          <aside className="dashboard-side">
            <article className="next-card"><span className="dashboard-eyebrow">UP NEXT</span>{nextTask?<><h3>{nextTask.title}</h3><p>{nextTask.startHour%12||12}:00 {nextTask.startHour<12?"AM":"PM"} · {nextTask.durationHrs} hour{nextTask.durationHrs>1?"s":""}</p><button onClick={()=>navigate("/focus",{state:{taskId:nextTask.id,title:nextTask.title}})}>Start focus <ArrowUpRight size={15}/></button></>:<><h3>Your next hour is open.</h3><p>Choose one meaningful thing and give it a place.</p><button onClick={()=>setModalHour(now.getHours())}>Plan this hour <Plus size={15}/></button></>}</article>
            <article className="value-card"><span>TIME VALUE</span><div className="value-orbit"><b>{Array.from({length:12},(_,i)=><i key={i} style={{"--i":i} as React.CSSProperties}/>)}</b><strong>{tasks.length}</strong><small>planned</small></div><p>Complete tasks and focused sessions to turn today into visible value.</p></article>
          </aside>
        </section>
      </main>
      {modalHour!==null&&<TaskModal hour={modalHour} onClose={()=>setModalHour(null)} onCreate={handleCreate}/>} 
    </div>
  );
}
