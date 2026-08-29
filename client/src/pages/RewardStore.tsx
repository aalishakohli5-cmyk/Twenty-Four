import { useEffect, useMemo, useState } from "react";
import { Check, Coins, LockKeyhole, ShoppingBag, Sparkles, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";
import { applyDashboardTheme, getDashboardTheme, type DashboardTheme } from "../lib/preferences";

interface Reward {
  id: string;
  name: string;
  description: string | null;
  category: string;
  priceCoins: number;
  owned: boolean;
  active: boolean;
}

export default function RewardStore() {
  const [aurora, setAurora] = useState<Reward | null>(null);
  const [balance, setBalance] = useState(0);
  const [theme, setTheme] = useState<DashboardTheme>(getDashboardTheme());
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const [{ rewards }, wallet] = await Promise.all([api.get("/api/rewards"), api.get("/api/wallet")]);
      setAurora((rewards as Reward[]).find((reward) => reward.name === "Aurora") ?? rewards[0] ?? null);
      setBalance(wallet.balance);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Marketplace could not load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  const canAfford = useMemo(() => Boolean(aurora && balance >= aurora.priceCoins), [aurora, balance]);

  function chooseDefault() {
    applyDashboardTheme("midnight");
    setTheme("midnight");
    setMessage("Midnight theme applied.");
  }

  async function unlockOrUseAurora() {
    if (!aurora || working) return;
    if (!aurora.owned && !canAfford) {
      setMessage(`You need ${aurora.priceCoins - balance} more coins to unlock Aurora.`);
      return;
    }
    setWorking(true);
    setMessage("");
    try {
      if (!aurora.owned) await api.post("/api/rewards/purchase", { rewardId: aurora.id });
      await api.post("/api/rewards/activate", { rewardId: aurora.id });
      applyDashboardTheme("aurora");
      setTheme("aurora");
      setMessage(aurora.owned ? "Aurora theme applied." : "Aurora unlocked and applied.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "That purchase did not go through");
    } finally {
      setWorking(false);
    }
  }

  const price = aurora?.priceCoins ?? 200;
  return <div className="dashboard-shell marketplace-shell"><Navbar/><main className="dashboard-main marketplace-main">
    <header className="marketplace-header">
      <div><span className="dashboard-eyebrow"><ShoppingBag size={14}/> THEME MARKET</span><h1>Reward Marketplace</h1><p>Turn focused hours into a space that feels unmistakably yours.</p></div>
      <div className="market-balance"><Coins size={20}/><span><small>AVAILABLE</small><strong>{balance} coins</strong></span></div>
    </header>

    <section className="market-progress"><div><span>Earn your next unlock</span><strong>{Math.min(balance, price)} / {price} coins</strong></div><div className="market-progress-track"><i style={{width:`${Math.min(100, balance / price * 100)}%`}}/></div><p><Zap size={13}/> 10 coins per focused hour · task bonuses stack on top</p></section>
    {message && <div className="market-message" role="status">{message}</div>}

    <section className="theme-market-grid" aria-busy={loading}>
      <article className={`theme-product midnight-product ${theme === "midnight" ? "selected" : ""}`}>
        <div className="theme-preview midnight-preview"><span className="preview-stars"/><div className="preview-sidebar"/><div className="preview-cards"><i/><i/><i/></div><strong>24</strong></div>
        <div className="theme-product-copy"><span>CORE THEME</span><h2>Midnight Ledger</h2><p>Deep navy, warm gold and quiet contrast for distraction-free planning.</p><ul><li><Check/>Always owned</li><li><Check/>Calm navy dashboard</li></ul></div>
        <footer><strong>Free</strong><button onClick={chooseDefault} disabled={theme === "midnight"}>{theme === "midnight" ? <><Check/> In use</> : "Use theme"}</button></footer>
      </article>

      <article className={`theme-product aurora-product ${theme === "aurora" ? "selected" : ""}`}>
        <div className="theme-preview aurora-preview"><span className="aurora-ribbon one"/><span className="aurora-ribbon two"/><span className="aurora-ribbon three"/><div className="preview-sidebar"/><div className="preview-cards"><i/><i/><i/></div><strong>24</strong><Sparkles className="preview-spark"/></div>
        <div className="theme-product-copy"><span>LIMITED THEME</span><h2>Aurora</h2><p>Living green light, neon edges and deep forest panels across the complete dashboard.</p><ul><li><Check/>Animated aurora atmosphere</li><li><Check/>All dashboard pages transform</li></ul></div>
        <footer><strong>{loading ? "—" : `${price} coins`}</strong><button onClick={unlockOrUseAurora} disabled={loading || working || theme === "aurora" || (!aurora?.owned && !canAfford)}>{theme === "aurora" ? <><Check/> In use</> : aurora?.owned ? "Use theme" : canAfford ? "Unlock Aurora" : <><LockKeyhole/> Need {price - balance}c</>}</button></footer>
      </article>
    </section>
    <aside className="market-note"><Sparkles/><div><strong>A fair unlock, not a grind</strong><p>Aurora costs 200 coins—the equivalent of 20 focused hours, 7 hard tasks, or a realistic mix of focus and completed work.</p></div></aside>
  </main></div>;
}
