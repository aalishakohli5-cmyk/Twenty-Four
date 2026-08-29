import { CalendarCheck, CheckCircle2, Clock3, Coins, PauseCircle, ShieldCheck, ShoppingBag, Sparkles, TriangleAlert } from "lucide-react";
import Navbar from "../components/Navbar";

const rewards = [
  { label: "Easy task", value: "+5", detail: "A small, clear action" },
  { label: "Medium task", value: "+15", detail: "Meaningful focused work" },
  { label: "Hard task", value: "+30", detail: "Deep or demanding work" },
];

export default function Rules() {
  return <div className="dashboard-shell rules-shell"><Navbar/><main className="dashboard-main rules-main">
    <header className="rules-header"><span className="dashboard-eyebrow">THE TWENTYFOUR MANUAL</span><h1>Make every hour count.</h1><p>A transparent guide to earning coins, protecting your balance and unlocking your workspace.</p></header>

    <section className="rules-principles">
      <article><Clock3/><span>01</span><h2>Plan with intention</h2><p>Give each planned block one clear task. Planning creates direction; completed work creates value.</p></article>
      <article><Sparkles/><span>02</span><h2>Focus honestly</h2><p>The focus timer awards <strong>10 coins for every verified hour</strong>. Partial hours earn proportionally.</p></article>
      <article><ShoppingBag/><span>03</span><h2>Build your world</h2><p>Spend earned coins in the Reward Marketplace. Purchased themes stay permanently unlocked.</p></article>
    </section>

    <section className="rules-ledger">
      <div className="rules-section-heading"><div><span>COIN LEDGER</span><h2>How you earn</h2></div><p>Task rewards are added on top of focused-time coins.</p></div>
      <div className="earning-grid"><article className="focus-rate"><Clock3/><small>FOCUSED STUDY</small><strong>+10 <em>coins / hour</em></strong><p>Only time completed through a focus session counts.</p></article>{rewards.map((reward)=><article key={reward.label}><CheckCircle2/><small>{reward.label}</small><strong>{reward.value} <em>coins</em></strong><p>{reward.detail}</p></article>)}</div>
      <div className="rules-example"><Coins/><div><strong>Example day</strong><p>2 focused hours + 1 medium task + 1 easy task = <b>40 coins</b>.</p></div><span>20 + 15 + 5</span></div>
    </section>

    <section className="protection-grid">
      <article className="penalty-card"><TriangleAlert/><div><span>DAILY ACCOUNTABILITY</span><h2>10% inactive-day deduction</h2><p>If you plan no task for an entire day and Pause Mode is off, 10% of your current balance is deducted. The system uses a percentage so the rule stays fair at every level.</p></div></article>
      <article className="pause-card"><ShieldCheck/><div><span>REST WITHOUT PENALTY</span><h2>Pause Mode protects real life</h2><p>Unwell, travelling, or handling serious work? Turn on Pause Mode in Settings before your break. During the selected period, inactive days do not reduce your coins.</p><a href="/settings"><PauseCircle/> Open Pause Mode</a></div></article>
    </section>

    <section className="unlock-guide"><div className="rules-section-heading"><div><span>REWARD MARKETPLACE</span><h2>What your effort unlocks</h2></div><p>Prices are based on the earning rates above—not arbitrary points.</p></div><article><div className="mini-aurora"><i/><i/><i/><b>24</b></div><div><small>THEME</small><h3>Aurora</h3><p>Animated neon-green atmosphere across the full dashboard.</p></div><strong>200 coins</strong><span>≈ 20 focus hours<br/>or 7 hard tasks</span></article></section>

    <footer className="rules-footer"><CalendarCheck/><p><strong>The simple rule:</strong> plan what matters, focus honestly, finish what you can, and pause responsibly when life needs your attention.</p></footer>
  </main></div>;
}
