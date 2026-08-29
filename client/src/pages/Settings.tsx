import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Check, CircleUserRound, MoonStar, PauseCircle, Play, ShieldCheck, Sun } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { api } from "../lib/api";

const dayOptions = [1, 3, 7];

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [restDays, setRestDays] = useState<Array<{ date: string; reason: string | null }>>([]);
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState("Unwell / recovery");
  const [saved, setSaved] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const pause = restDays.length > 0;
  const lastRestDay = restDays[restDays.length - 1];
  const untilLabel = useMemo(() => lastRestDay ? new Date(lastRestDay.date).toLocaleDateString(undefined, { weekday:"short", day:"numeric", month:"short", year:"numeric", timeZone:"UTC" }) : "", [lastRestDay]);

  useEffect(() => {
    api.get("/api/settings").then(({ restDays }) => setRestDays(restDays)).catch((err) => setError(err instanceof Error ? err.message : "Settings could not load"));
  }, []);

  async function startPause() {
    setWorking(true); setError("");
    try {
      await api.post("/api/settings/pause", { days, reason });
      const data = await api.get("/api/settings");
      setRestDays(data.restDays); setSaved(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Pause Mode could not be saved"); }
    finally { setWorking(false); }
  }

  async function endPause() {
    setWorking(true); setError("");
    try { await api.delete("/api/settings/pause"); setRestDays([]); setSaved(false); }
    catch (err) { setError(err instanceof Error ? err.message : "Pause Mode could not be ended"); }
    finally { setWorking(false); }
  }

  return <div className="dashboard-shell settings-shell"><Navbar/><main className="dashboard-main settings-main">
    <header className="settings-header"><div><span className="dashboard-eyebrow">ACCOUNT & PROTECTION</span><h1>Settings</h1><p>Keep your account fair without pretending real life never interrupts.</p></div><div className="settings-user"><CircleUserRound/><span><small>SIGNED IN AS</small><strong>{user?.email}</strong></span></div></header>

    <section className="appearance-settings-card">
      <div><span className="appearance-icon">{theme === "dark" ? <MoonStar/> : <Sun/>}</span><div><small>APPEARANCE</small><h2>{theme === "dark" ? "Dark mode" : "Light mode"}</h2><p>Switch the base interface while keeping your unlocked marketplace theme.</p></div></div>
      <button className="theme-mode-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} aria-pressed={theme === "light"}>
        <span className="theme-mode-track" aria-hidden="true"><i>{theme === "dark" ? <MoonStar/> : <Sun/>}</i></span>
        <span>Use {theme === "dark" ? "light" : "dark"}</span>
      </button>
    </section>

    {error && <div className="market-message" role="alert">{error}</div>}
    <section className={`pause-settings-card ${pause ? "is-paused" : ""}`}>
      <div className="pause-status-icon">{pause ? <PauseCircle/> : <ShieldCheck/>}</div>
      <div className="pause-intro"><span>BALANCE PROTECTION</span><h2>{pause ? "Pause Mode is active" : "Take leave without losing coins"}</h2><p>{pause ? `Your 10% inactive-day deduction is protected through ${untilLabel}.` : "Schedule a genuine break for illness, travel or urgent responsibilities. Inactive days inside the pause window are protected."}</p></div>
      {pause ? <div className="active-pause-panel"><div><CalendarClock/><span><small>PROTECTED THROUGH</small><strong>{untilLabel}</strong><em>{lastRestDay?.reason}</em></span></div><button onClick={endPause} disabled={working}><Play/> Resume TwentyFour</button></div> : <div className="pause-controls">
        <fieldset><legend>How long do you need?</legend><div>{dayOptions.map(option=><button type="button" key={option} className={days===option?"selected":""} onClick={()=>setDays(option)}>{option}<small>{option===1?"day":"days"}</small></button>)}</div></fieldset>
        <label><span>Reason</span><select value={reason} onChange={(event)=>setReason(event.target.value)}><option>Unwell / recovery</option><option>Travel / leave</option><option>Urgent personal work</option><option>Digital rest day</option></select></label>
        <button className="activate-pause" onClick={startPause} disabled={working}><PauseCircle/> {working ? "Saving…" : `Protect the next ${days} ${days===1?"day":"days"}`}</button>
      </div>}
      {saved && pause && <div className="settings-saved"><Check/> Pause saved to your account</div>}
    </section>

    <aside className="pause-policy"><ShieldCheck/><div><strong>How protection works</strong><p>Pause Mode stops the 10% no-plan deduction during your selected window. It does not award coins or change completed work. Resume early whenever you are ready.</p></div></aside>
  </main></div>;
}
