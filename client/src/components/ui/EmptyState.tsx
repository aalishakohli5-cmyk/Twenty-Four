import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-6 text-text-secondary">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="font-display text-xl md:text-2xl font-bold mb-2">{title}</h3>
      <p className="text-text-secondary text-sm max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="md">{actionLabel}</Button>
      )}
    </motion.div>
  );
}
