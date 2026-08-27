import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  note: string | null;
  createdAt: string;
}

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/wallet").then((data) => {
      setBalance(data.balance);
      setStreakDays(data.streakDays);
      setTransactions(data.transactions);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold">Wallet</h1>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-panel p-6">
            <p className="mb-1 text-xs text-cream/50">Balance</p>
            <p className="text-3xl font-semibold text-gold">{balance}c</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-panel p-6">
            <p className="mb-1 text-xs text-cream/50">Streak</p>
            <p className="text-3xl font-semibold">{streakDays} days</p>
          </div>
        </div>

        <h2 className="mb-3 text-sm font-medium text-cream/60">Recent transactions</h2>
        {loading ? (
          <p className="text-cream/40">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-cream/40">No transactions yet — complete a task or focus session.</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-panel px-4 py-3"
              >
                <div>
                  <p className="text-sm">{t.note ?? t.type.replace(/_/g, " ").toLowerCase()}</p>
                  <p className="text-xs text-cream/40">
                    {new Date(t.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className={`text-sm font-semibold ${t.amount >= 0 ? "text-gold" : "text-coral"}`}>
                  {t.amount >= 0 ? "+" : ""}
                  {t.amount}c
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
