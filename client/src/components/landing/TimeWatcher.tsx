import { useEffect, useRef, useState } from 'react';
import { useHeroPointer } from '../../hooks/useHeroPointer';

interface TimeWatcherProps {
  className?: string;
  alert?: boolean;
  celebrate?: boolean;
}

export function TimeWatcher({ className = '', alert = false, celebrate = false }: TimeWatcherProps) {
  const pointer = useHeroPointer();
  const eyeLRef = useRef<SVGCircleElement>(null);
  const eyeRRef = useRef<SVGCircleElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const [blink, setBlink] = useState(false);
  const mobileRef = useRef({ t: 0 });

  useEffect(() => {
    let raf = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    const tick = () => {
      const { x, y } = pointer.current;
      const maxEye = 2.8;
      const ex = finePointer && !reduced ? x * maxEye : Math.sin(mobileRef.current.t * 0.4) * 0.8;
      const ey = finePointer && !reduced ? y * maxEye : Math.cos(mobileRef.current.t * 0.35) * 0.6;

      eyeLRef.current?.setAttribute('cx', String(38 + ex));
      eyeLRef.current?.setAttribute('cy', String(42 + ey));
      eyeRRef.current?.setAttribute('cx', String(62 + ex));
      eyeRRef.current?.setAttribute('cy', String(42 + ey));

      const headRot = finePointer && !reduced ? x * 3 : Math.sin(mobileRef.current.t * 0.25) * 1.2;
      const headY = finePointer && !reduced ? y * 2 : Math.sin(mobileRef.current.t * 0.5) * 1.5;
      if (headRef.current) {
        headRef.current.style.transform = `rotate(${headRot}deg) translateY(${headY}px)`;
      }

      mobileRef.current.t += 0.016;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pointer]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timeout: ReturnType<typeof setTimeout>;
    let blinkOffTimeout: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      const delay = 2800 + Math.random() * 4200;
      timeout = setTimeout(() => {
        setBlink(true);
        blinkOffTimeout = setTimeout(() => setBlink(false), 140);
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
    return () => {
      clearTimeout(timeout);
      clearTimeout(blinkOffTimeout);
    };
  }, []);

  return (
    <div
      className={`timewatcher ${alert ? 'timewatcher--alert' : ''} ${celebrate ? 'timewatcher--celebrate' : ''} ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="timewatcher-svg">
        <defs>
          <linearGradient id="tw-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="50%" stopColor="#0d0d0d" />
            <stop offset="100%" stopColor="#252525" />
          </linearGradient>
          <linearGradient id="tw-rim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c8ff00" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c8ff00" stopOpacity="0.2" />
          </linearGradient>
          <filter id="tw-glow">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <line x1="50" y1="8" x2="50" y2="18" stroke="#c8ff00" strokeWidth="1.2" opacity="0.6" />
        <circle cx="50" cy="7" r="2" fill="#c8ff00" opacity="0.8" className="timewatcher-pulse-dot" />

        <g ref={headRef} className="timewatcher-head" style={{ transformOrigin: '50px 52px' }}>
          <rect x="22" y="22" width="56" height="52" rx="14" fill="url(#tw-body)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
          <rect x="26" y="26" width="48" height="44" rx="10" fill="none" stroke="url(#tw-rim)" strokeWidth="0.6" opacity="0.5" />
          <rect x="28" y="34" width="44" height="22" rx="8" fill="#050505" stroke="rgba(200,255,0,0.25)" strokeWidth="0.8" />

          <g className={blink ? 'timewatcher-blink' : ''}>
            <ellipse cx="38" cy="42" rx="5" ry={blink ? 0.6 : 4} fill="#c8ff00" filter="url(#tw-glow)" />
            <ellipse cx="62" cy="42" rx="5" ry={blink ? 0.6 : 4} fill="#c8ff00" filter="url(#tw-glow)" />
            <circle ref={eyeLRef} cx="38" cy="42" r="1.8" fill="#050505" />
            <circle ref={eyeRRef} cx="62" cy="42" r="1.8" fill="#050505" />
          </g>

          <g opacity="0.35">
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={34 + i * 6} y="58" width="3" height="6" rx="1" fill="#c8ff00" />
            ))}
          </g>

          <circle cx="24" cy="48" r="1" fill="rgba(200,255,0,0.4)" />
          <circle cx="76" cy="48" r="1" fill="rgba(200,255,0,0.4)" />
        </g>

        <path d="M38 74 L50 82 L62 74" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <ellipse cx="50" cy="86" rx="18" ry="4" fill="#0a0a0a" stroke="rgba(200,255,0,0.2)" strokeWidth="0.6" />
      </svg>
    </div>
  );
}
