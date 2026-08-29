import { motion } from 'framer-motion';
import { Focus, CheckCircle, ShoppingBag, Gift, TrendingDown } from 'lucide-react';
import type { Transaction } from '../../types';
import { CoinBadge } from '../ui/CoinBadge';

interface TransactionRowProps {
  transaction: Transaction;
}

const iconMap = {
  focus: Focus,
  task: CheckCircle,
  store: ShoppingBag,
  bonus: Gift,
  decay: TrendingDown,
};

export function TransactionRow({ transaction }: TransactionRowProps) {
  const Icon = iconMap[transaction.icon as keyof typeof iconMap] || Focus;
  const isPositive = transaction.amount > 0;
  const date = new Date(transaction.timestamp);
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        isPositive ? 'bg-accent-lime/10 text-accent-lime' : 'bg-accent-orange/10 text-accent-orange'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{transaction.description}</p>
        <p className="text-xs text-text-secondary mt-0.5">
          {isToday ? 'Today' : date.toLocaleDateString()} {timeStr}
        </p>
      </div>
      <CoinBadge
        amount={transaction.amount}
        size="md"
        className={isPositive ? '' : 'text-accent-orange/80'}
      />
    </motion.div>
  );
}
