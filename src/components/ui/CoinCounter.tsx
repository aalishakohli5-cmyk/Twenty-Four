import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface CoinCounterProps {
  value: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export function CoinCounter({ value, className = '', size = 'md' }: CoinCounterProps) {
  const spring = useSpring(value, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());
  const [text, setText] = useState(value.toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    return display.on('change', (v) => setText(v));
  }, [display]);

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    hero: 'text-6xl md:text-8xl',
  };

  return (
    <motion.span
      key={value}
      className={`font-mono font-bold tracking-tight ${sizes[size]} ${className}`}
    >
      {text}
    </motion.span>
  );
}
