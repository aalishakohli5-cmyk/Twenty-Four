import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CoinCounter } from '../components/ui/CoinCounter';
import { ProgressRing } from '../components/ui/ProgressRing';
import { TransactionRow } from '../components/wallet/TransactionRow';
import { EmptyState } from '../components/ui/EmptyState';
import { getTodayDateString } from '../utils/time';

export function WalletPage() {
  const { state } = useApp();
  const today = getTodayDateString();

  const todayEarned = state.transactions
    .filter((t) => t.amount > 0 && t.timestamp.startsWith(today))
    .reduce((sum, t) => sum + t.amount, 0);

  const todaySpent = state.transactions
    .filter((t) => t.amount < 0 && t.timestamp.startsWith(today))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const progressPercent = Math.min(100, (state.walletBalance / 2000) * 100);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="font-condensed text-xs tracking-[0.2em] text-accent-lime">YOUR WEALTH</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-2">WALLET</h1>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent-orange/10 rounded-full blur-3xl" />
          <p className="font-condensed text-xs tracking-widest text-text-secondary">TOTAL BALANCE</p>
          <div className="flex items-end gap-3 mt-4">
            <CoinCounter value={state.walletBalance} size="hero" className="text-accent-orange" />
          </div>
          <p className="font-condensed text-sm tracking-[0.3em] text-text-secondary mt-2">COINS</p>

          <div className="flex items-center justify-center mt-8">
            <div className="relative">
              <ProgressRing progress={progressPercent} size={140} />
              <Coins className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-accent-orange" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8"
        >
          <p className="font-condensed text-xs tracking-widest text-text-secondary mb-6">TODAY</p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="font-condensed text-xs tracking-widest text-text-secondary">EARNED</p>
              <p className="font-mono text-3xl font-bold text-accent-lime mt-2">+{todayEarned}</p>
            </div>
            <div>
              <p className="font-condensed text-xs tracking-widest text-text-secondary">SPENT</p>
              <p className="font-mono text-3xl font-bold text-accent-orange mt-2">-{todaySpent}</p>
            </div>
          </div>
          {state.streak > 0 && (
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="font-condensed text-xs tracking-widest text-accent-pink">STREAK BONUS</p>
              <p className="text-sm text-text-secondary mt-1">{state.streak} days — 100 coins at 7 days</p>
            </div>
          )}
        </motion.div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold mb-4">TRANSACTION HISTORY</h2>
        {state.transactions.length === 0 ? (
          <EmptyState
            title="YOUR WALLET IS EMPTY."
            description="Time to start earning. Complete tasks and focus sessions."
          />
        ) : (
          <div className="glass-card rounded-2xl px-6">
            {state.transactions.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
