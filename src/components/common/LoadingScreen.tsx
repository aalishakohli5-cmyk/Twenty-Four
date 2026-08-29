import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1100);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_60%)]" />
      <p className="font-display text-6xl text-white tracking-tight">24</p>
      <p className="font-condensed text-sm tracking-[0.3em] text-zinc-500 mt-6">
        INITIALIZING YOUR DAY...
      </p>
      <div className="w-32 h-0.5 bg-white/10 rounded-full mt-8 overflow-hidden">
        <motion.div
          className="h-full bg-white"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
