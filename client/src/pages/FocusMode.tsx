import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, CalendarDays, Check, ChevronRight, CircleDollarSign, Clock3, Coffee, Expand, Flame, ListChecks, Pause, Play, RotateCcw, Sparkles, Square, Target, TimerReset, X } from "lucide-react";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";

type Task = { id: string; title: string; category?: string | null; startHour: number; durationHrs: number; difficulty: "SHORT" | "MEDIUM" | "DIFFICULT"; status: string };
type Totals = { minutes: number; coins: number; sessions: number };
type Summary = { today: Totals; week: Totals; month: Totals };
type TimerState = "idle" | "running" | "paused" | "complete";

const presets = [
  { minutes: 25, label: "Sprint", note: "Pomodoro" },
  { minutes: 50, label: "Deep", note: "Long focus" },
  { minutes: 90, label: "Flow", note: "Full cycle" },
];

const emptySummary: Summary = { today:{minutes:0,coins:0,sessions:0}, week:{minutes:0,coins:0,sessions:0}, month:{minutes:0,coins:0,sessions:0} };

function formatClock(total: number) {
  const safe = Math.max(0, total);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

function formatHour(hour: number) {
  const suffix = hour < 12 ? "AM" : "PM";
  return `${hour % 12 || 12} ${suffix}`;
}

export default function FocusMode() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = location.state as { taskId?: string; title?: string } | undefined;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState(routeState?.taskId ?? "");
  const [duration, setDuration] = useState(25);
  const [customDuration, setCustomDuration] = useState("");
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [earned, setEarned] = useState({ coins:0, minutes:0 });
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const [zen, setZen] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const todayKey = new Date().toISOString();
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);
  const targetSeconds = duration * 60;
  const remaining = Math.max(0, targetSeconds - elapsed);
  const progress = Math.min(1, elapsed / targetSeconds);
  const projectedCoins = Math.floor((elapsed / 3600) * 10);

  const loadDashboard = useCallback(async () => {
    try {
      const [{ tasks }, focusSummary] = await Promise.all([
        api.get(`/api/tasks?date=${todayKey}`),
        api.get("/api/focus/summary"),
      ]);
      setTasks(tasks);
      setSummary(focusSummary);
      if (!selectedTaskId && routeState?.taskId) setSelectedTaskId(routeState.taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Focus workspace could not load");
    }
  }, [routeState?.taskId, selectedTaskId, todayKey]);

  useEffect(() => { loadDashboard(); }, []);
  useEffect(() => () => { if (tickRef.current) clearInterval(tickRef.current); }, []);

  const closeTicker = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
  };

  const beginTicker = () => {
    closeTicker();
    tickRef.current = setInterval(() => setElapsed((value) => value + 1), 1000);
  };

  async function openServerSession() {
    const { session } = await api.post("/api/focus/start", { taskId: selectedTaskId || undefined });
    setSessionId(session.id);
  }

  async function closeServerSession() {
    if (!sessionId) return;
    const result = await api.post(`/api/focus/${sessionId}/end`);
    setEarned((current) => ({ coins:current.coins + result.coinsEarned, minutes:current.minutes + result.focusedMins }));
    setSessionId(null);
  }

  async function start() {
    setWorking(true); setError("");
    try {
      await openServerSession();
      setTimerState("running");
      beginTicker();
    } catch (err) { setError(err instanceof Error ? err.message : "Session could not start"); }
    finally { setWorking(false); }
  }

  async function pause() {
    setWorking(true); closeTicker();
    try { await closeServerSession(); setTimerState("paused"); await loadDashboard(); }
    catch (err) { setError(err instanceof Error ? err.message : "Session could not pause"); }
    finally { setWorking(false); }
  }

  async function resume() {
    setWorking(true); setError("");
    try { await openServerSession(); setTimerState("running"); beginTicker(); }
    catch (err) { setError(err instanceof Error ? err.message : "Session could not resume"); }
    finally { setWorking(false); }
  }

  async function finish() {
    setWorking(true); closeTicker();
    try {
      await closeServerSession();
      setTimerState("complete");
      await loadDashboard();
    } catch (err) { setError(err instanceof Error ? err.message : "Session could not finish"); }
    finally { setWorking(false); }
  }

  function reset() {
    if (timerState === "running" || sessionId) return;
    setElapsed(0); setEarned({coins:0,minutes:0}); setTimerState("idle"); setError("");
  }

  useEffect(() => {
    if (timerState === "running" && elapsed >= targetSeconds) finish();
  }, [elapsed, targetSeconds, timerState]);

  function chooseDuration(minutes: number) {
    if (timerState !== "idle") return;
    setDuration(minutes); setCustomDuration(""); setElapsed(0);
  }

  function applyCustom() {
    const value = Math.min(180, Math.max(5, Number(customDuration) || 25));
    setDuration(value); setElapsed(0); setCustomDuration(String(value));
  }

  const weekDays = useMemo(() => Array.from({length:7},(_,index)=>{
    const date = new Date();
    const mondayOffset = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - mondayOffset + index);
    return { label:date.toLocaleDateString(undefined,{weekday:"short"}).slice(0,2), day:date.getDate(), today:date.toDateString()===new Date().toDateString() };
  }), []);

  return <div className={`dashboard-shell focus-workspace-shell ${zen ? "focus-zen" : ""}`}><Navbar/><main className="dashboard-main focus-workspace-main">
    <header className="focus-workspace-header"><div><button onClick={()=>navigate("/today")}><ArrowLeft/> MY DAY</button><span className="dashboard-eyebrow">FOCUS STUDIO</span><h1>Protect this hour.</h1><p>Choose one thing, set a rhythm, and make the work visible.</p></div><div className="focus-header-actions"><div><Flame/><span><small>TODAY</small><strong>{formatMinutes(summary.today.minutes)} focused</strong></span></div><button onClick={()=>setZen(!zen)}><Expand/>{zen ? "Exit focus view" : "Distraction-free"}</button></div></header>
    {error && <div className="market-message" role="alert">{error}</div>}

    <section className="focus-layout">
      <article className="focus-engine">
        <div className="focus-engine-top"><div><span>{timerState === "complete" ? "SESSION COMPLETE" : timerState === "running" ? "FOCUSING NOW" : timerState === "paused" ? "PAUSED · TIME PROTECTED" : "READY WHEN YOU ARE"}</span><h2>{selectedTask?.title ?? routeState?.title ?? "Choose today’s priority"}</h2></div><div className={`focus-live-dot ${timerState}`}/></div>

        <div className="focus-preset-row">{presets.map((preset)=><button key={preset.minutes} disabled={timerState!=="idle"} className={duration===preset.minutes&&!customDuration?"active":""} onClick={()=>chooseDuration(preset.minutes)}><strong>{preset.minutes}</strong><span>{preset.label}<small>{preset.note}</small></span></button>)}<div className={`custom-preset ${customDuration?"active":""}`}><TimerReset/><input aria-label="Custom focus minutes" inputMode="numeric" value={customDuration} onChange={(event)=>setCustomDuration(event.target.value.replace(/\D/g,""))} placeholder="Custom" disabled={timerState!=="idle"}/><button onClick={applyCustom} disabled={timerState!=="idle"}>Set</button></div></div>

        <div className="focus-clock-stage">
          <div className="focus-clock-glow"/>
          <svg viewBox="0 0 260 260" className="focus-progress-ring"><circle className="focus-ring-track" cx="130" cy="130" r="112"/><circle className="focus-ring-value" cx="130" cy="130" r="112" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress}/>{Array.from({length:24},(_,index)=><line key={index} x1="130" y1="10" x2="130" y2={index%6===0?"22":"18"} transform={`rotate(${index*15} 130 130)`}/>)}</svg>
          <div className="focus-clock-copy"><small>{timerState === "complete" ? "DONE" : "TIME REMAINING"}</small><strong>{timerState === "complete" ? formatClock(elapsed) : formatClock(remaining)}</strong><span><CircleDollarSign/> +{projectedCoins + earned.coins} coin estimate</span></div>
        </div>

        <div className="focus-controls">
          {timerState === "idle" && <button className="focus-primary" onClick={start} disabled={working}><Play/> Start {duration}-minute focus</button>}
          {timerState === "running" && <><button onClick={pause} disabled={working}><Pause/> Pause</button><button className="focus-stop" onClick={finish} disabled={working}><Square/> Finish session</button></>}
          {timerState === "paused" && <><button className="focus-primary" onClick={resume} disabled={working}><Play/> Resume focus</button><button className="focus-stop" onClick={finish} disabled={working}><Square/> Finish here</button></>}
          {timerState === "complete" && <><button className="focus-primary" onClick={reset}><RotateCcw/> Start another</button><button onClick={()=>navigate("/today")}><Check/> Back to my day</button></>}
        </div>
        <div className="focus-session-meta"><span><Clock3/> {formatClock(elapsed)} focused now</span><i/><span><Coffee/> Break suggestion: {duration>=50?"10":"5"} min</span><i/><span><Sparkles/> {earned.minutes} verified min banked</span></div>
      </article>

      <aside className="focus-sidebar">
        <section className="focus-task-card"><header><div><ListChecks/><span><small>TODAY’S PRIORITY</small><strong>Select a planned task</strong></span></div><button onClick={()=>navigate("/today")}>Edit day <ChevronRight/></button></header><div className="focus-task-list">{tasks.length ? tasks.map((task)=><button key={task.id} onClick={()=>timerState==="idle"&&setSelectedTaskId(task.id)} className={selectedTaskId===task.id?"selected":""} disabled={timerState!=="idle"}><span className={`task-difficulty ${task.difficulty.toLowerCase()}`}/><div><strong>{task.title}</strong><small>{formatHour(task.startHour)} · {task.durationHrs}h · {task.difficulty === "SHORT" ? "+5c" : task.difficulty === "MEDIUM" ? "+15c" : "+30c"}</small></div>{selectedTaskId===task.id?<Check/>:<ChevronRight/>}</button>) : <div className="empty-focus-tasks"><Target/><strong>No tasks planned yet</strong><p>You can still focus freely, or add a task to connect time with progress.</p><button onClick={()=>navigate("/today")}>Plan my day</button></div>}</div></section>

        <section className="focus-calendar-card"><header><div><CalendarDays/><span><small>THIS WEEK</small><strong>{new Date().toLocaleDateString(undefined,{month:"long",year:"numeric"})}</strong></span></div><time>{new Date().toLocaleDateString(undefined,{day:"2-digit",month:"short"}).toUpperCase()}</time></header><div className="focus-week-strip">{weekDays.map((day)=><span className={day.today?"today":""} key={`${day.label}${day.day}`}><small>{day.label}</small><strong>{day.day}</strong>{day.today&&<i/>}</span>)}</div><p><Clock3/> Your focused minutes appear here as the week grows.</p></section>
      </aside>
    </section>

    <section className="focus-insights"><header><div><BarChart3/><span><small>FOCUS ANALYTICS</small><strong>Your verified progress</strong></span></div><p>Only completed server-timed sessions count.</p></header><div>{(["today","week","month"] as const).map((period)=><article key={period}><span>{period.toUpperCase()}</span><strong>{formatMinutes(summary[period].minutes)}</strong><div className="focus-stat-bar"><i style={{width:`${Math.min(100,summary[period].minutes/(period==="today"?120:period==="week"?600:2400)*100)}%`}}/></div><footer><small>{summary[period].sessions} sessions</small><small>+{summary[period].coins} coins</small></footer></article>)}</div></section>
  </main><button className="zen-exit" onClick={()=>setZen(false)}><X/> Exit focus view</button></div>;
}
