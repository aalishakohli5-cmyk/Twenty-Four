import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', hover = false, onClick }: GlassCardProps) {
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      onClick={onClick}
      whileHover={hover ? { y: -2, rotate: hover ? 0.5 : 0 } : undefined}
      className={`glass-card rounded-2xl p-5 ${onClick ? 'cursor-pointer text-left w-full' : ''} ${className}`}
    >
      {children}
    </Component>
  );
}
