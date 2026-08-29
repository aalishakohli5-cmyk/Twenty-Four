import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionOptional } from '../../context/MotionContext';

interface CoinRewardAnimationProps {
  amount: number;
  show: boolean;
  onComplete: () => void;
  message?: string;
}

export function CoinRewardAnimation({
  amount,
  show,
  onComplete,
  message = 'TASK COMPLETE',
}: CoinRewardAnimationProps) {
  const motionCtx = useMotionOptional();

  useEffect(() => {
    if (show) motionCtx?.celebrate();
  }, [show, motionCtx]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.12, opacity: 0, y: -48 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="relative text-center"
          >
            <p className="font-condensed text-sm tracking-[0.3em] text-text-secondary mb-4">
              {message}
            </p>
            <motion.div
              className="flex items-center justify-center"
              animate={{ y: [0, -10, -36], opacity: [1, 1, 0] }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
            >
              <span className="font-mono text-6xl md:text-7xl font-bold text-accent-orange">
                +{amount}
              </span>
            </motion.div>
            <p className="font-condensed text-xs tracking-widest text-accent-orange mt-2">COINS</p>

            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-accent-orange"
                style={{ top: '50%', left: '50%' }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i / 12) * Math.PI * 2) * (70 + i * 3),
                  y: Math.sin((i / 12) * Math.PI * 2) * (70 + i * 3) - 24,
                  opacity: 0,
                }}
                transition={{ duration: 0.65, delay: 0.08 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
