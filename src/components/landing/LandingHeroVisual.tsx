import { useEffect, useRef } from 'react';
import { Hero24Visual } from '../common/Hero24Visual';
import { TimeWatcher } from './TimeWatcher';
import { useHeroPointer } from '../../hooks/useHeroPointer';

interface LandingHeroVisualProps {
  ctaAlert?: boolean;
  ctaCelebrate?: boolean;
  orbitBoost?: boolean;
}

export function LandingHeroVisual({ ctaAlert, ctaCelebrate, orbitBoost }: LandingHeroVisualProps) {
  const pointer = useHeroPointer();
  const orbitRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reduced) return;

    const tick = () => {
      const { x, y } = pointer.current;
      if (orbitRef.current) {
        const ox = finePointer ? x * 4 : 0;
        const oy = finePointer ? y * 3 : 0;
        orbitRef.current.style.transform = `translate(${ox}px, ${oy}px)`;
      }
      if (visualRef.current) {
        const vx = finePointer ? x * 8 : 0;
        const vy = finePointer ? y * 6 : 0;
        visualRef.current.style.transform = `translate(${vx}px, ${vy}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pointer]);

  return (
    <div className={`landing-hero-stage ${orbitBoost ? 'landing-hero-stage--boost' : ''}`}>
      <div ref={orbitRef} className="landing-hero-orbit-wrap">
        <Hero24Visual size="hero" orbitBoost={orbitBoost} />
      </div>
      <div ref={visualRef} className="landing-hero-watcher-wrap">
        <TimeWatcher alert={ctaAlert} celebrate={ctaCelebrate} />
      </div>
    </div>
  );
}
