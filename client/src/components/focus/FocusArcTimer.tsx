interface FocusArcTimerProps {
  progress: number;
  label: string;
  sublabel?: string;
  size?: number;
}

export function FocusArcTimer({
  progress,
  label,
  sublabel = 'Flow time',
  size = 320,
}: FocusArcTimerProps) {
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2 + 20;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const progressAngle = startAngle + (endAngle - startAngle) * (progress / 100);

  const arcPoint = (angle: number) => ({
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  });

  const bgStart = arcPoint(startAngle);
  const bgEnd = arcPoint(endAngle);
  const progEnd = arcPoint(progressAngle);

  const bgPath = `M ${bgStart.x} ${bgStart.y} A ${radius} ${radius} 0 0 1 ${bgEnd.x} ${bgEnd.y}`;
  const largeArc = progress > 50 ? 1 : 0;
  const progPath =
    progress > 0
      ? `M ${bgStart.x} ${bgStart.y} A ${radius} ${radius} 0 ${largeArc} 1 ${progEnd.x} ${progEnd.y}`
      : '';

  return (
    <div className="relative mx-auto" style={{ width: size, height: size * 0.62 }}>
      <svg width={size} height={size * 0.62} viewBox={`0 0 ${size} ${size * 0.62}`} className="overflow-visible">
        <defs>
          <linearGradient id="focusArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-orange)" />
            <stop offset="100%" stopColor="var(--accent-lime)" />
          </linearGradient>
          <filter id="focusArcGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={bgPath}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {progPath && (
          <path
            d={progPath}
            fill="none"
            stroke="url(#focusArcGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            filter="url(#focusArcGlow)"
            className="motion-sensitive transition-all duration-1000 ease-out"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 pointer-events-none">
        <p className="font-condensed text-[10px] tracking-[0.25em] text-white/45 mb-1">{sublabel}</p>
        <p className="font-mono text-5xl md:text-6xl font-bold tabular-nums tracking-tight text-white">
          {label}
        </p>
      </div>
    </div>
  );
}
