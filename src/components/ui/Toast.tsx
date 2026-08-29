import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, CheckCircle, AlertCircle, Info } from 'lucide-react';
import type { ToastMessage } from '../../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    coins: Coins,
  };

  return (
    <div className="fixed top-20 md:top-24 right-4 z-[200] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg"
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  toast.type === 'coins' ? 'text-accent-orange' :
                  toast.type === 'success' ? 'text-accent-lime' :
                  toast.type === 'error' ? 'text-accent-orange' : 'text-text-secondary'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{toast.message}</p>
                {toast.amount !== undefined && (
                  <p className="font-mono text-accent-orange text-xs">+{toast.amount} COINS</p>
                )}
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="p-1 hover:bg-white/10 rounded"
                aria-label="Dismiss"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
