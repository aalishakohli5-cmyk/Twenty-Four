import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";

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
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    const { rewards } = await api.get("/api/rewards");
    setRewards(rewards);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handlePurchase(rewardId: string) {
    setError("");
    try {
      await api.post("/api/rewards/purchase", { rewardId });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed");
    }
  }

  async function handleActivate(rewardId: string) {
    await api.post("/api/rewards/activate", { rewardId });
    await load();
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold">Reward store</h1>

        {error && <p className="mb-4 text-sm text-coral">{error}</p>}

        {loading ? (
          <p className="text-cream/40">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rewards.map((r) => (
              <div key={r.id} className="rounded-2xl border border-white/10 bg-panel p-5">
                <p className="mb-1 text-xs uppercase tracking-wide text-cream/40">{r.category}</p>
                <h3 className="mb-1 font-medium">{r.name}</h3>
                <p className="mb-4 text-sm text-cream/50">{r.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gold">{r.priceCoins}c</span>
                  {r.owned ? (
                    r.active ? (
                      <span className="rounded-lg bg-gold/20 px-3 py-1.5 text-xs text-gold">Active</span>
                    ) : (
                      <button
                        onClick={() => handleActivate(r.id)}
                        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:border-gold hover:text-gold"
                      >
                        Use
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handlePurchase(r.id)}
                      className="rounded-lg bg-gold px-3 py-1.5 text-xs font-medium text-ink"
                    >
                      Unlock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
