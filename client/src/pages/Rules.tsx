import { BookOpenText, Clock3, Coins, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Rules() {
  return <div className="dashboard-shell rules-shell"><Navbar/><main className="dashboard-main rules-main">
    <header className="rules-header"><span className="dashboard-eyebrow">THE TWENTYFOUR MANUAL</span><h1>Know the rules.<br/><em>Make time count.</em></h1><p>This is where your full points system and product guide will live.</p></header>
    <section className="rules-preview">
      <article><Clock3/><span>01</span><h2>Plan your hours</h2><p>Choose a start and end time, then give that block one clear purpose.</p></article>
      <article><Sparkles/><span>02</span><h2>Focus for real</h2><p>Start a focus session from a planned task and keep the clock honest.</p></article>
      <article><Coins/><span>03</span><h2>Earn visible value</h2><p>Focused time and completed work become coins you can use in TwentyFour.</p></article>
    </section>
    <div className="rules-coming"><BookOpenText/><div><strong>Full manual coming next</strong><p>Coin values, deductions, streak protection and rewards will be added when you finalize the rules.</p></div></div>
  </main></div>;
}
