import { useEffect, useState, type CSSProperties, type ElementType } from "react";
import { BarChart3, CalendarCheck, CheckCircle2, Clock3, Coins, Focus, Sparkles, Trophy } from "lucide-react";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";

interface Report { plannedHours:number; completedHours:number; focusedMinutes:number; coinsEarned:number; tasksCompleted:number; tasksTotal:number; mostProductiveHour:number|null; }
interface ReportStat { label:string; value:string|number; detail:string; icon:ElementType; tone:string; }
function formatHour(hour:number){const period=hour<12?"AM":"PM";return `${hour%12||12} ${period}`;}

export default function DailyReport(){
  const [report,setReport]=useState<Report|null>(null);
  const [error,setError]=useState("");
  useEffect(()=>{api.get(`/api/reports/daily?date=${new Date().toISOString()}`).then(setReport).catch((reason)=>setError(reason instanceof Error?reason.message:"Report could not load"));},[]);
  const completion=report?.tasksTotal?Math.round(report.tasksCompleted/report.tasksTotal*100):0;
  const stats:ReportStat[]=report?[
    {label:"Planned hours",value:report.plannedHours,detail:"Hours given a purpose",icon:CalendarCheck,tone:"blue"},
    {label:"Completed hours",value:report.completedHours,detail:"Planned time completed",icon:CheckCircle2,tone:"mint"},
    {label:"Focused minutes",value:report.focusedMinutes,detail:"Verified deep-work time",icon:Focus,tone:"violet"},
    {label:"Coins earned",value:`+${report.coinsEarned}c`,detail:"Value created today",icon:Coins,tone:"gold"},
    {label:"Tasks completed",value:`${report.tasksCompleted}/${report.tasksTotal}`,detail:`${completion}% completion rate`,icon:BarChart3,tone:"coral"},
    {label:"Peak hour",value:report.mostProductiveHour!==null?formatHour(report.mostProductiveHour):"—",detail:"Your strongest hour today",icon:Trophy,tone:"gold"},
  ]:[];

  return <div className="dashboard-shell insight-shell report-shell"><Navbar/><main className="dashboard-main insight-main">
    <header className="insight-header report-header"><div><span className="dashboard-eyebrow"><BarChart3/> DAILY INTELLIGENCE</span><h1>Your day, <em>in focus.</em></h1><p>{new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})} · A clear look at where your time became value.</p></div><div className="report-score"><span>{completion}%</span><small>DAY COMPLETE</small><i style={{"--score":`${completion*3.6}deg`} as CSSProperties}/></div></header>
    {!report?<section className="report-loading insight-empty">{error?<><strong>Report unavailable</strong><p>{error}</p></>:<><span className="insight-loader"/><strong>Reading your day…</strong><p>Gathering tasks, focus sessions and earned value.</p></>}</section>:<><section className="report-summary"><div><Sparkles/><span><small>TODAY AT A GLANCE</small><strong>{report.tasksCompleted?`You completed ${report.tasksCompleted} task${report.tasksCompleted===1?"":"s"} and protected ${report.focusedMinutes} focused minutes.`:"Your day is still open—plan one meaningful hour to begin."}</strong></span></div><p><Clock3/> {report.completedHours} of {report.plannedHours} planned hours complete</p></section><section className="report-stat-grid">{stats.map(({label,value,detail,icon:Icon,tone})=><article key={label}><span className={`insight-icon ${tone}`}><Icon/></span><small>{label}</small><strong>{value}</strong><p>{detail}</p><i/></article>)}</section></>}
  </main></div>;
}
