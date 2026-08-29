import { useEffect, useRef, useState } from 'react';
import type { AvatarId } from '../../types';
import { AvatarArt } from '../avatars/AvatarArt';

interface AvatarPreviewProps {
  avatarId: AvatarId;
  className?: string;
  interactive?: boolean;
}

export function AvatarPreview({ avatarId, className = '', interactive = true }: AvatarPreviewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [lookAngle, setLookAngle] = useState(0);

  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setLookAngle((Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [interactive]);

  const isPulse = avatarId === 'pulse';

  return (
    <div
      ref={wrapRef}
      className={`relative h-full min-h-[11rem] flex flex-col items-center justify-center overflow-hidden bg-bg-secondary/60 ${className}`}
    >
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_35%,var(--glow-hero-1),transparent_60%)]" />
      <div
        className={`relative motion-sensitive animate-genz-float-a ${
          isPulse ? 'drop-shadow-[0_0_12px_rgba(57,255,20,0.35)]' : 'drop-shadow-[0_4px_14px_rgba(0,0,0,0.15)]'
        }`}
      >
        <AvatarArt id={avatarId} lookAngle={lookAngle} size={88} />
      </div>
      <p className="relative mt-3 font-condensed text-[9px] tracking-[0.25em] text-text-secondary">
        {interactive ? 'MOVE CURSOR · EYES FOLLOW' : 'TRACKS YOUR CURSOR'}
      </p>
    </div>
  );
}
