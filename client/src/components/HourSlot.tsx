import { ArrowRight, Check, Plus } from "lucide-react";

interface Task { id:string; title:string; status:string; durationHrs:number; difficulty:"SHORT"|"MEDIUM"|"DIFFICULT"; }
interface Props { hour:number; task?:Task; potentialCoins:number; onClick:()=>void; current?:boolean; taskStart?:boolean; }

function formatHour(h:number) {
  const period = h < 12 ? "AM" : "PM";
  return `${h % 12 === 0 ? 12 : h % 12} ${period}`;
}

export default function HourSlot({ hour, task, potentialCoins, onClick, current=false, taskStart=true }:Props) {
  const peak = (hour >= 4 && hour < 8) || hour >= 23 || hour < 3;
  const completed = task?.status === "COMPLETED";
  return (
    <button onClick={onClick} className={`timeline-slot ${task ? "filled" : "empty"} ${task&&!taskStart?"continuation":""} ${completed ? "completed" : ""} ${peak ? "peak" : ""} ${current ? "current" : ""}`}>
      <span className="timeline-time">{formatHour(hour)}</span>
      <span className="timeline-rail"><i /></span>
      <span className="timeline-content">
        {task ? taskStart ? <><strong>{task.title}</strong><small>{task.durationHrs} hour{task.durationHrs > 1 ? "s" : ""} · {task.difficulty.toLowerCase()}</small></> : <span className="timeline-booked-label">Booked</span> : <span className="timeline-coin-arrow" aria-hidden="true"><ArrowRight size={18}/></span>}
      </span>
      <span className="timeline-coins">+{potentialCoins}<small> coins</small></span>
      <span className="timeline-action">{completed ? <Check size={16}/> : <Plus size={16}/>}</span>
    </button>
  );
}
