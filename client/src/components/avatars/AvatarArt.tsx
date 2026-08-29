import { useId, type ReactNode } from 'react';
import type { AvatarId } from '../../types';

interface AvatarArtProps {
  id: AvatarId;
  lookAngle?: number;
  size?: number;
  className?: string;
}

const PULSE_LIME = '#39ff14';
const PULSE_ORANGE = '#ff6b4a';
const PULSE_CYAN = '#00ffff';
const PULSE_BODY = '#2a2a4a';
const OUTLINE = '#2a2a2a';

function AvatarDefs({ uid }: { uid: string }) {
  return (
    <defs>
      <filter id={`avatar-shadow-${uid}`} x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.22" />
      </filter>
      <linearGradient id={`skin-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffe8d6" />
        <stop offset="100%" stopColor="#ffcba4" />
      </linearGradient>
      <linearGradient id={`hair-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#333" />
        <stop offset="100%" stopColor="#111" />
      </linearGradient>
    </defs>
  );
}

function AvatarFrame({
  uid,
  size,
  className,
  children,
  rotate = -4,
}: {
  uid: string;
  size: number;
  className?: string;
  children: ReactNode;
  rotate?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      className={className}
      aria-hidden
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <AvatarDefs uid={uid} />
      <g filter={`url(#avatar-shadow-${uid})`}>{children}</g>
    </svg>
  );
}

function StickerEyes({
  lookAngle,
  leftCx = 22,
  rightCx = 34,
  cy = 26,
}: {
  lookAngle: number;
  leftCx?: number;
  rightCx?: number;
  cy?: number;
}) {
  const eyeOffset = Math.max(-3.5, Math.min(3.5, Math.cos((lookAngle * Math.PI) / 180) * 3.5));
  const pupilY = Math.max(-2.5, Math.min(2.5, Math.sin((lookAngle * Math.PI) / 180) * 2.5));

  return (
    <>
      <ellipse cx={leftCx + eyeOffset} cy={cy + pupilY} rx="2.4" ry="3" fill="#fff" stroke={OUTLINE} strokeWidth="0.8" />
      <ellipse cx={rightCx + eyeOffset} cy={cy + pupilY} rx="2.4" ry="3" fill="#fff" stroke={OUTLINE} strokeWidth="0.8" />
      <ellipse cx={leftCx + eyeOffset} cy={cy + pupilY} rx="1.5" ry="2" fill="#111" />
      <ellipse cx={rightCx + eyeOffset} cy={cy + pupilY} rx="1.5" ry="2" fill="#111" />
      <circle cx={leftCx + 1 + eyeOffset} cy={cy - 1 + pupilY} r="0.7" fill="#fff" />
      <circle cx={rightCx + 1 + eyeOffset} cy={cy - 1 + pupilY} r="0.7" fill="#fff" />
    </>
  );
}

/** Floating 3D companion art — no sticker box, works on light + dark themes. */
export function AvatarArt({ id, lookAngle = 0, size = 56, className = '' }: AvatarArtProps) {
  const uid = useId().replace(/:/g, '');

  if (id === 'shinchan') {
    return (
      <AvatarFrame uid={uid} size={size} className={className} rotate={-5}>
        <circle cx="28" cy="30" r="18" fill={`url(#skin-${uid})`} stroke={OUTLINE} strokeWidth="1.8" />
        <ellipse cx="28" cy="18" rx="16" ry="10" fill={`url(#hair-${uid})`} stroke={OUTLINE} strokeWidth="1.5" />
        <path d="M14 18 Q28 8 42 18" fill={`url(#hair-${uid})`} stroke={OUTLINE} strokeWidth="1.2" />
        <path d="M10 28 Q28 22 46 28" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <StickerEyes lookAngle={lookAngle} />
        <circle cx="28" cy="34" r="2.5" fill="#ffb4a2" opacity="0.6" />
        <rect x="16" y="40" width="24" height="12" rx="4" fill="#e63946" stroke={OUTLINE} strokeWidth="1.5" />
        <rect x="18" y="50" width="9" height="6" rx="2" fill="#ffd60a" stroke={OUTLINE} strokeWidth="1" />
        <rect x="29" y="50" width="9" height="6" rx="2" fill="#ffd60a" stroke={OUTLINE} strokeWidth="1" />
      </AvatarFrame>
    );
  }

  if (id === 'sakura') {
    return (
      <AvatarFrame uid={uid} size={size} className={className} rotate={3}>
        <circle cx="28" cy="30" r="17" fill="#ffe8ef" stroke={OUTLINE} strokeWidth="1.8" />
        <path d="M12 22 C16 8 40 8 44 22 C42 12 14 12 12 22" fill="#ffb7c5" stroke={OUTLINE} strokeWidth="1.5" />
        <path d="M10 20 C18 14 38 14 46 20" stroke="#ff8fab" strokeWidth="2" fill="none" />
        <StickerEyes lookAngle={lookAngle} />
        <path d="M24 34 Q28 37 32 34" stroke="#d6336c" strokeWidth="1.5" fill="none" />
        <rect x="17" y="40" width="22" height="11" rx="3" fill="#fff0f6" stroke={OUTLINE} strokeWidth="1.5" />
        <circle cx="44" cy="14" r="3" fill="#ffb7c5" stroke={OUTLINE} strokeWidth="1" />
        <circle cx="12" cy="16" r="2" fill="#ffb7c5" stroke={OUTLINE} strokeWidth="1" />
      </AvatarFrame>
    );
  }

  if (id === 'kenji') {
    return (
      <AvatarFrame uid={uid} size={size} className={className} rotate={-3}>
        <circle cx="28" cy="30" r="17" fill={`url(#skin-${uid})`} stroke={OUTLINE} strokeWidth="1.8" />
        <rect x="12" y="18" width="32" height="8" rx="2" fill="#2b2d42" stroke={OUTLINE} strokeWidth="1.5" />
        <path d="M14 26 C20 32 36 32 42 26" fill="#3a3d5c" stroke={OUTLINE} strokeWidth="1.2" />
        <StickerEyes lookAngle={lookAngle} />
        <rect x="18" y="40" width="20" height="10" rx="2" fill="#4cc9f0" stroke={OUTLINE} strokeWidth="1.5" />
        <rect x="10" y="22" width="8" height="14" rx="4" fill="#222" stroke={OUTLINE} strokeWidth="1.2" />
        <rect x="38" y="22" width="8" height="14" rx="4" fill="#222" stroke={OUTLINE} strokeWidth="1.2" />
      </AvatarFrame>
    );
  }

  if (id === 'neko') {
    const eyeOffset = Math.max(-3.5, Math.min(3.5, Math.cos((lookAngle * Math.PI) / 180) * 3.5));
    const pupilY = Math.max(-2.5, Math.min(2.5, Math.sin((lookAngle * Math.PI) / 180) * 2.5));

    return (
      <AvatarFrame uid={uid} size={size} className={className} rotate={4}>
        <circle cx="28" cy="32" r="16" fill="#f1f3f5" stroke={OUTLINE} strokeWidth="1.8" />
        <polygon points="14,22 18,10 24,20" fill="#ffd8a8" stroke={OUTLINE} strokeWidth="1.5" />
        <polygon points="42,22 38,10 32,20" fill="#ffd8a8" stroke={OUTLINE} strokeWidth="1.5" />
        <ellipse cx={22 + eyeOffset * 0.5} cy={30 + pupilY * 0.5} rx="2.4" ry="3.2" fill="#fff" stroke={OUTLINE} strokeWidth="0.8" />
        <ellipse cx={34 + eyeOffset * 0.5} cy={30 + pupilY * 0.5} rx="2.4" ry="3.2" fill="#fff" stroke={OUTLINE} strokeWidth="0.8" />
        <ellipse cx={22 + eyeOffset * 0.5} cy={30 + pupilY * 0.5} rx="1.3" ry="2" fill="#212529" />
        <ellipse cx={34 + eyeOffset * 0.5} cy={30 + pupilY * 0.5} rx="1.3" ry="2" fill="#212529" />
        <polygon points="28,33 26,35 30,35" fill="#ff8787" />
        <line x1="18" y1="32" x2="8" y2="29" stroke="#868e96" strokeWidth="1.2" />
        <line x1="38" y1="32" x2="48" y2="29" stroke="#868e96" strokeWidth="1.2" />
        <rect x="18" y="42" width="20" height="8" rx="2" fill="#adb5bd" stroke={OUTLINE} strokeWidth="1.5" />
        <rect x="36" y="44" width="8" height="6" rx="1" fill="#fff" stroke={OUTLINE} strokeWidth="1" />
      </AvatarFrame>
    );
  }

  if (id === 'pulse') {
    const leftEyeX = 22.5 + Math.max(-3, Math.min(3, Math.cos((lookAngle * Math.PI) / 180) * 3));
    const rightEyeX = 33.5 + Math.max(-3, Math.min(3, Math.cos((lookAngle * Math.PI) / 180) * 3));
    const eyeY = 26.5 + Math.max(-2, Math.min(2, Math.sin((lookAngle * Math.PI) / 180) * 2));

    return (
      <AvatarFrame uid={uid} size={size} className={className} rotate={-2}>
        <rect x="9" y="9" width="38" height="38" rx="10" fill={PULSE_BODY} stroke={OUTLINE} strokeWidth="1.8" />
        <rect x="9" y="9" width="38" height="38" rx="10" fill="none" stroke={PULSE_LIME} strokeWidth="1.5" opacity="0.9" />
        <rect x="18" y="16" width="20" height="4" rx="2" fill={PULSE_CYAN} opacity="0.9" stroke={OUTLINE} strokeWidth="0.6" />
        <rect x={leftEyeX - 5} y={eyeY - 5} width="10" height="10" rx="2.5" fill="#12122a" stroke={PULSE_LIME} strokeWidth="1.5" />
        <rect x={rightEyeX - 5} y={eyeY - 5} width="10" height="10" rx="2.5" fill="#12122a" stroke={PULSE_LIME} strokeWidth="1.5" />
        <circle cx={leftEyeX} cy={eyeY} r="3" fill={PULSE_LIME} />
        <circle cx={rightEyeX} cy={eyeY} r="3" fill={PULSE_LIME} />
        <circle cx={leftEyeX + 1} cy={eyeY - 1} r="1" fill="#fff" />
        <circle cx={rightEyeX + 1} cy={eyeY - 1} r="1" fill="#fff" />
        <rect x="20" y="36" width="16" height="3.5" rx="1.75" fill={PULSE_ORANGE} stroke={OUTLINE} strokeWidth="0.6" />
        <line x1="14" y1="42" x2="42" y2="42" stroke={PULSE_CYAN} strokeWidth="2" opacity="0.85" />
      </AvatarFrame>
    );
  }

  return null;
}
