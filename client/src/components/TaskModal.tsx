import { useRef, useState } from "react";
import { Clock3, X } from "lucide-react";

interface Props { hour:number; onClose:()=>void; onCreate:(data:{title:string;category:string;startHour:number;durationHrs:number;difficulty:"SHORT"|"MEDIUM"|"DIFFICULT"})=>Promise<void>; }
type Handle = "start" | "end";

function formatHour(hour:number) {
  if (hour === 24) return "12 AM";
  return `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`;
}

export default function TaskModal({ hour,onClose,onCreate }:Props) {
  const [title,setTitle]=useState("");
  const [category,setCategory]=useState("");
  const [startHour,setStartHour]=useState(hour);
  const [endHour,setEndHour]=useState(Math.min(hour+1,24));
  const [activeHandle,setActiveHandle]=useState<Handle>("end");
  const [difficulty,setDifficulty]=useState<"SHORT"|"MEDIUM"|"DIFFICULT">("SHORT");
  const [saving,setSaving]=useState(false);
  const dialRef=useRef<HTMLDivElement>(null);

  function updateDial(clientX:number,clientY:number) {
    const rect=dialRef.current?.getBoundingClientRect(); if(!rect) return;
    const x=clientX-(rect.left+rect.width/2), y=clientY-(rect.top+rect.height/2);
    const degrees=(Math.atan2(y,x)*180/Math.PI+450)%360;
    let chosen=Math.round(degrees/15)%24;
    if(activeHandle==="start") { chosen=Math.min(chosen,22); setStartHour(chosen); if(chosen>=endHour)setEndHour(chosen+1); else if(endHour-chosen>12)setEndHour(chosen+12); }
    else { let end=chosen===0?24:chosen; end=Math.max(startHour+1,Math.min(end,startHour+12,24)); setEndHour(end); }
  }
  function handlePointer(e:React.PointerEvent<HTMLDivElement>) { e.currentTarget.setPointerCapture(e.pointerId); updateDial(e.clientX,e.clientY); }
  async function handleSubmit(e:React.FormEvent) { e.preventDefault(); if(!title.trim())return; setSaving(true); try{await onCreate({title:title.trim(),category:category.trim()||"custom",startHour,durationHrs:endHour-startHour,difficulty});onClose();}finally{setSaving(false);} }

  const startAngle=startHour*15, endAngle=endHour*15;
  return <div className="task-modal-backdrop" onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}>
    <form onSubmit={handleSubmit} className="task-scheduler">
      <button type="button" className="task-close" onClick={onClose} aria-label="Close"><X size={18}/></button>
      <header><span><Clock3 size={15}/> SHAPE THIS TIME</span><h2>When will you work?</h2><p>Choose a start, then rotate the end hand around the dial.</p></header>
      <div className="scheduler-body">
        <div className="time-dial-wrap">
          <div ref={dialRef} className="time-dial" style={{"--start":`${startAngle}deg`,"--end":`${endAngle}deg`,"--range":`${endAngle-startAngle}deg`} as React.CSSProperties} onPointerDown={handlePointer} onPointerMove={(e)=>e.buttons===1&&updateDial(e.clientX,e.clientY)}>
            {Array.from({length:24},(_,i)=><i key={i} className={i>=startHour&&i<endHour?"selected":""} style={{"--hour":i} as React.CSSProperties}><b>{i%3===0?(i||24):""}</b></i>)}
            <span className="dial-hand dial-start"/><span className="dial-hand dial-end"/><em className="dial-center"><strong>{endHour-startHour}h</strong><small>planned</small></em>
          </div>
          <div className="time-choice-row">
            <button type="button" className={activeHandle==="start"?"active":""} onClick={()=>setActiveHandle("start")}><small>FROM</small><strong>{formatHour(startHour)}</strong></button>
            <span>→</span>
            <button type="button" className={activeHandle==="end"?"active":""} onClick={()=>setActiveHandle("end")}><small>TO</small><strong>{formatHour(endHour)}</strong></button>
          </div>
        </div>
        <div className="scheduler-fields">
          <label><span>What will you do?</span><input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Finish the pitch deck" required/></label>
          <label><span>Category <small>optional</small></span><input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Type your own category"/></label>
          <label><span>Difficulty</span><select value={difficulty} onChange={e=>setDifficulty(e.target.value as typeof difficulty)}><option value="SHORT">Short · +5 coins</option><option value="MEDIUM">Medium · +10 coins</option><option value="DIFFICULT">Difficult · +20 coins</option></select></label>
          <div className="scheduler-actions"><button type="button" onClick={onClose}>Cancel</button><button type="submit" disabled={saving}>{saving?"Booking time...":"Book this time"}</button></div>
        </div>
      </div>
    </form>
  </div>;
}
