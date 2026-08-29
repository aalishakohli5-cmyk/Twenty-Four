import {
  BookOpen,
  GraduationCap,
  Coins,
  PenLine,
  Brain,
  Timer,
  Target,
  Sparkles,
  Laptop,
  Coffee,
} from 'lucide-react';
import { useReducedMotion } from '../../hooks/useFocusTimer';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'hero' | 'minimal';
  className?: string;
}

const STUDY_FLOATS = [
  { Icon: BookOpen, left: '8%', top: '22%', delay: '0s', size: 28 },
  { Icon: GraduationCap, left: '82%', top: '18%', delay: '2s', size: 32 },
  { Icon: Coins, left: '75%', top: '62%', delay: '4s', size: 24 },
  { Icon: PenLine, left: '12%', top: '68%', delay: '1s', size: 26 },
  { Icon: Brain, left: '48%', top: '78%', delay: '3s', size: 30 },
  { Icon: Timer, left: '62%', top: '38%', delay: '1.5s', size: 22 },
  { Icon: Target, left: '28%', top: '42%', delay: '2.5s', size: 24 },
  { Icon: Sparkles, left: '88%', top: '48%', delay: '0.5s', size: 20 },
  { Icon: Laptop, left: '38%', top: '14%', delay: '3.5s', size: 26 },
  { Icon: Coffee, left: '18%', top: '52%', delay: '4.5s', size: 22 },
];

const DECO_CARDS = [
  { left: '55%', top: '12%', w: 64, h: 80, rotate: 12, reverse: true },
  { left: '22%', top: '72%', w: 80, h: 56, rotate: -6, reverse: false },
  { left: '70%', top: '76%', w: 56, h: 72, rotate: 8, reverse: true },
];

export function AnimatedBackground({ variant = 'default', className = '' }: AnimatedBackgroundProps) {
  const reduced = useReducedMotion();
  const isMinimal = variant === 'minimal';

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden genz-bg study-bg ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[var(--bg-atmosphere,transparent)]" />
      <div className="absolute inset-0 study-notebook-lines opacity-[0.35]" />
      <div className="absolute inset-0 study-desk-lamp" />

      <div
        className={`absolute -top-24 -left-20 w-[min(70vw,480px)] h-[min(70vw,480px)] rounded-full blur-[120px] ${
          reduced ? 'opacity-30' : 'opacity-40 motion-sensitive animate-genz-float-a'
        }`}
        style={{ background: 'var(--glow-hero-1, rgba(125,255,178,0.12))' }}
      />
      <div
        className={`absolute -bottom-32 -right-16 w-[min(75vw,520px)] h-[min(75vw,520px)] rounded-full blur-[130px] ${
          reduced ? 'opacity-25' : 'opacity-35 motion-sensitive animate-genz-float-b'
        }`}
        style={{ background: 'var(--glow-hero-2, rgba(255,107,74,0.1))' }}
      />

      <div
        className={`absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(95vw,780px)] h-[min(80vh,620px)] rounded-full ${
          reduced ? 'opacity-40' : 'motion-sensitive animate-genz-breathe opacity-50'
        }`}
        style={{
          background:
            'radial-gradient(circle, var(--glow-hero-spot, rgba(255,255,255,0.06)) 0%, transparent 68%)',
        }}
      />

      {!reduced && (
        <>
          {STUDY_FLOATS.map(({ Icon, left, top, delay, size }, i) => (
            <div
              key={i}
              className={`absolute study-float-icon motion-sensitive ${
                i % 2 === 0 ? 'animate-study-float' : 'animate-study-float-reverse'
              } ${isMinimal ? 'opacity-70' : ''}`}
              style={{ left, top, animationDelay: delay }}
            >
              <Icon size={isMinimal ? size * 0.85 : size} strokeWidth={1.2} />
            </div>
          ))}

          {DECO_CARDS.map(({ left, top, w, h, rotate, reverse }, i) => (
            <div
              key={`deco-${i}`}
              className={`absolute study-deco-card rounded-md motion-sensitive ${
                reverse ? 'animate-study-float-reverse' : 'animate-study-float'
              } ${isMinimal ? 'opacity-50' : 'opacity-60'}`}
              style={{
                left,
                top,
                width: w,
                height: h,
                transform: `rotate(${rotate}deg)`,
                animationDelay: `${i * 1.2}s`,
              }}
            />
          ))}
        </>
      )}

      <div
        className={`absolute inset-3 md:inset-5 rounded-[28px] border border-transparent ${
          reduced ? 'opacity-25' : 'motion-sensitive animate-genz-border-pulse opacity-35'
        }`}
        style={{
          background:
            'linear-gradient(#0000, #0000) padding-box, linear-gradient(135deg, color-mix(in srgb, var(--accent-pink) 22%, transparent), transparent 40%, color-mix(in srgb, var(--accent-orange) 18%, transparent)) border-box',
        }}
      />

      {!reduced && !isMinimal && (
        <>
          <div
            className="absolute top-[18%] right-[12%] w-32 h-32 rounded-full blur-3xl motion-sensitive animate-genz-drift opacity-60"
            style={{ background: 'color-mix(in srgb, var(--accent-lime) 14%, transparent)' }}
          />
          <div
            className="absolute bottom-[22%] left-[10%] w-40 h-40 rounded-full blur-3xl motion-sensitive animate-genz-drift-reverse opacity-60"
            style={{ background: 'color-mix(in srgb, var(--accent-orange) 12%, transparent)' }}
          />
        </>
      )}

      {!reduced && (
        <>
          <div
            className="absolute top-1/4 left-0 w-full h-px motion-sensitive animate-line-drift opacity-50"
            style={{
              background:
                'linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent-lime) 12%, transparent), transparent)',
            }}
          />
          <div
            className="absolute top-[68%] left-0 w-full h-px motion-sensitive animate-line-drift-reverse opacity-50"
            style={{
              background:
                'linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent-pink) 10%, transparent), transparent)',
            }}
          />
        </>
      )}

      {!reduced && (
        <div className="absolute inset-0 motion-sensitive animate-particle-drift opacity-70">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${6 + (i * 11) % 88}%`,
                top: `${10 + (i * 13) % 78}%`,
                backgroundColor: 'color-mix(in srgb, var(--accent-lime) 25%, transparent)',
                opacity: 0.2 + (i % 3) * 0.08,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
