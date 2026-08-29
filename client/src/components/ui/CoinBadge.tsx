import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

interface CoinBadgeProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showSign?: boolean;
  className?: string;
}

export function CoinBadge({ amount, size = 'md', showSign = true, className = '' }: CoinBadgeProps) {
  const sizes = {
    sm: 'text-xs gap-1',
    md: 'text-sm gap-1.5',
    lg: 'text-base gap-2',
  };

  const sign = amount >= 0 ? '+' : '';

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center font-mono font-semibold text-accent-orange ${sizes[size]} ${className}`}
    >
      <Coins className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      {showSign && sign}{Math.abs(amount)}
    </motion.span>
  );
}
