import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Coins, Flame, ReceiptText, Sparkles, WalletCards } from "lucide-react";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";

interface Transaction { id:string; type:string; amount:number; note:string|null; createdAt:string; }

export default function Wallet() {
  const [balance,setBalance]=useState(0);
  const [streakDays,setStreakDays]=useState(0);
  const [transactions,setTransactions]=useState<Transaction[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  useEffect(()=>{ api.get("/api/wallet").then((data)=>{ setBalance(data.balance); setStreakDays(data.streakDays); setTransactions(data.transactions); }).catch((reason)=>setError(reason instanceof Error?reason.message:"Wallet could not load")).finally(()=>setLoading(false)); },[]);
  const earned=transactions.filter((item)=>item.amount>0).reduce((sum,item)=>sum+item.amount,0);
  const spent=Math.abs(transactions.filter((item)=>item.amount<0).reduce((sum,item)=>sum+item.amount,0));

  return <div className="dashboard-shell insight-shell wallet-shell"><Navbar/><main className="dashboard-main insight-main">
    <header className="insight-header">
      <div><span className="dashboard-eyebrow"><WalletCards/> VALUE LEDGER</span><h1>Your wallet.</h1><p>Every coin is a visible record of focused time and finished work.</p></div>
      <div className="wallet-balance-orbit"><span><Coins/></span><small>AVAILABLE BALANCE</small><strong>{loading?"—":balance}<em>c</em></strong><i/></div>
    </header>
    <section className="wallet-stat-grid">
      <article><span className="insight-icon gold"><Coins/></span><div><small>LIFETIME EARNED</small><strong>+{earned}c</strong><p>Across your recent activity</p></div><ArrowUpRight/></article>
      <article><span className="insight-icon coral"><ArrowDownLeft/></span><div><small>SPENT & ADJUSTED</small><strong>{spent}c</strong><p>Rewards and balance changes</p></div></article>
      <article><span className="insight-icon mint"><Flame/></span><div><small>CURRENT STREAK</small><strong>{streakDays} days</strong><p>Keep showing up intentionally</p></div></article>
    </section>
    <section className="ledger-panel">
      <header><div><span className="insight-icon"><ReceiptText/></span><div><small>COIN HISTORY</small><h2>Recent transactions</h2></div></div><span>{transactions.length} entries</span></header>
      {loading?<div className="insight-empty"><span className="insight-loader"/><strong>Waking your ledger…</strong><p>Your Render service may take a moment after being idle.</p></div>:error?<div className="insight-empty error"><strong>Wallet unavailable</strong><p>{error}</p></div>:transactions.length===0?<div className="insight-empty"><Sparkles/><strong>Your first coin is waiting.</strong><p>Complete a task or verified focus session and it will appear here.</p></div>:<div className="transaction-list">{transactions.map((item)=><article key={item.id} className={item.amount>=0?"positive":"negative"}><span className="transaction-mark">{item.amount>=0?<ArrowUpRight/>:<ArrowDownLeft/>}</span><div><strong>{item.note??item.type.replace(/_/g," ").toLowerCase()}</strong><time>{new Date(item.createdAt).toLocaleString()}</time></div><b>{item.amount>=0?"+":""}{item.amount}c</b></article>)}</div>}
    </section>
  </main></div>;
}
