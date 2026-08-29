import { motion } from 'framer-motion';
import { getCurrentHour } from '../../utils/time';

interface Hero24VisualProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  animated?: boolean;
  orbitBoost?: boolean;
}

export function Hero24Visual({ size = 'md', animated = true, orbitBoost = false }: Hero24VisualProps) {
  const currentHour = getCurrentHour();
  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48 md:w-64 md:h-64',
    lg: 'w-72 h-72 md:w-96 md:h-96',
    hero: 'w-full max-w-[min(520px,42vw)] aspect-square',
  };

  const hours = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const radius = 42;
    return {
      x: 50 + radius * Math.cos(rad),
      y: 50 + radius * Math.sin(rad),
      hour: i,
    };
  });

  const ringDuration = orbitBoost ? 18 : 120;

  return (
    <div className={`hero-24-visual relative ${sizes[size]} mx-auto ${orbitBoost ? 'hero-24-visual--boost' : ''}`}>
      <motion.div
        className="absolute inset-0 rounded-full border border-white/10 hero-24-ring"
        animate={animated ? { rotate: 360 } : undefined}
        transition={animated ? { duration: ringDuration, repeat: Infinity, ease: 'linear' } : undefined}
      />

      <div className="absolute inset-4 rounded-full bg-[#c8ff00]/[0.06] blur-3xl" />

      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        {hours.map(({ x, y, hour }) => {
          const isCurrent = hour === currentHour;
          return (
            <motion.circle
              key={hour}
              cx={x}
              cy={y}
              r={isCurrent ? 2 : hour % 6 === 0 ? 1.2 : 0.6}
              fill={isCurrent ? '#c8ff00' : hour % 6 === 0 ? '#c8ff00' : 'rgba(255,255,255,0.28)'}
              opacity={isCurrent ? 1 : 0.85}
              initial={{ opacity: 0 }}
              animate={isCurrent && animated ? { opacity: [0.7, 1, 0.7] } : { opacity: isCurrent ? 1 : 0.85 }}
              transition={isCurrent && animated ? { duration: 2, repeat: Infinity } : { delay: hour * 0.02 }}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative hero-24-core"
          animate={animated ? { y: [0, -8, 0] } : undefined}
          transition={animated ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          <span className="font-display text-[clamp(4rem,12vw,7.5rem)] font-bold leading-none tracking-tighter">
            <span className="text-white/90">2</span>
            <span className="text-[#c8ff00] hero-24-glow">4</span>
          </span>
        </motion.div>
      </div>

      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-[#ff5a1f]/80"
          style={{ top: '50%', left: '50%' }}
          animate={animated ? {
            x: [0, Math.cos(i * 2.1) * 80, 0],
            y: [0, Math.sin(i * 2.1) * 80, 0],
            opacity: [0.4, 1, 0.4],
          } : undefined}
          transition={animated ? { duration: orbitBoost ? 1.5 + i * 0.3 : 3 + i, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />
      ))}

      <svg viewBox="0 0 100 100" className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)]">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#ringGradient24)"
          strokeWidth="0.5"
          strokeDasharray="4 4"
          opacity="0.45"
        />
        <defs>
          <linearGradient id="ringGradient24" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c8ff00" />
            <stop offset="100%" stopColor="#ff5a1f" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
