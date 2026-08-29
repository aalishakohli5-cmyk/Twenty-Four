import type { ThemeId, CustomThemeColors, ColorMode } from '../../types';
import type { CSSProperties } from 'react';
import { getThemeCssVars, getThemeTextGlow, resolveColorMode } from '../../lib/themeTokens';

interface ThemePreviewProps {
  themeId: ThemeId;
  size?: 'card' | 'modal';
  className?: string;
  customColors?: CustomThemeColors;
  colorMode?: ColorMode;
}

const THEME_LABELS: Record<ThemeId, string> = {
  default: 'MINIMAL',
  'midnight-grid': 'MIDNIGHT GRID',
  'neon-city': 'NEON CITY',
  orbital: 'ORBITAL',
  custom: 'CUSTOM',
};

export function ThemePreview({ themeId, size = 'card', className = '', customColors, colorMode = 'dark' }: ThemePreviewProps) {
  const isLarge = size === 'modal';
  const resolvedMode = resolveColorMode(colorMode);
  const vars = getThemeCssVars(themeId, resolvedMode, customColors);
  const textGlow = getThemeTextGlow(themeId, customColors, resolvedMode);

  const accentLime = vars['--accent-lime'];
  const accentOrange = vars['--accent-orange'];
  const accentPink = vars['--accent-pink'];
  const border = vars['--border'];
  const glowHero1 = vars['--glow-hero-1'];
  const glowHero2 = vars['--glow-hero-2'];
  const accentLimeFg = vars['--accent-lime-fg'];
  const cardInnerBg = vars['--bg-card'];

  return (
    <div
      className={`theme-preview-isolated relative overflow-hidden rounded-xl border bg-bg-primary text-text-primary ${className}`}
      style={{
        ...vars,
        borderColor: border,
      } as CSSProperties}
    >
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
      <div
        className="absolute top-0 right-0 rounded-full blur-3xl pointer-events-none motion-sensitive animate-genz-float-a"
        style={{
          width: isLarge ? '10rem' : '6rem',
          height: isLarge ? '10rem' : '6rem',
          backgroundColor: glowHero1,
        }}
      />
      <div
        className="absolute bottom-0 left-0 rounded-full blur-3xl pointer-events-none motion-sensitive animate-genz-float-b"
        style={{
          width: isLarge ? '8rem' : '5rem',
          height: isLarge ? '8rem' : '5rem',
          backgroundColor: glowHero2,
        }}
      />

      <div className={`relative ${isLarge ? 'p-6' : 'p-4'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-condensed text-[10px] tracking-[0.25em] text-text-secondary">
            {THEME_LABELS[themeId]}
          </span>
          <span className="font-mono text-[10px] text-accent-lime">24</span>
        </div>

        <div
          className={`font-display text-accent-lime text-hero-stat ${isLarge ? 'text-5xl' : 'text-3xl'}`}
          style={{ textShadow: textGlow }}
        >
          24
        </div>

        <div
          className={`mt-3 rounded-lg border backdrop-blur-sm ${isLarge ? 'p-4' : 'p-2.5'}`}
          style={{
            borderColor: border,
            backgroundColor: cardInnerBg,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className={`font-medium ${isLarge ? 'text-sm' : 'text-xs'}`}>Deep Study</p>
              <p className="font-condensed text-[9px] tracking-wider text-text-secondary mt-0.5">
                20:00 · FOCUS
              </p>
            </div>
            <span className="font-mono text-[10px] text-accent-orange">+10</span>
          </div>
          <div className="mt-2 h-1 rounded-full bg-theme-muted overflow-hidden">
            <div className="h-full w-2/3 rounded-full bg-accent-lime" />
          </div>
        </div>

        <div className={`flex items-center gap-2 ${isLarge ? 'mt-4' : 'mt-3'}`}>
          <span
            className={`rounded-md font-condensed font-semibold tracking-wider bg-accent-lime text-[var(--accent-lime-fg,#000)] ${
              isLarge ? 'px-3 py-1.5 text-xs' : 'px-2 py-1 text-[10px]'
            }`}
            style={{ color: accentLimeFg }}
          >
            FOCUS
          </span>
          <span
            className={`rounded-md border text-text-secondary font-condensed tracking-wider ${
              isLarge ? 'px-3 py-1.5 text-xs' : 'px-2 py-1 text-[10px]'
            }`}
            style={{ borderColor: border }}
          >
            PLAN
          </span>
        </div>

        <div className={`flex items-center gap-2 ${isLarge ? 'mt-4' : 'mt-3'}`}>
          <ColorSwatch label="Accent" color={accentLime} />
          <ColorSwatch label="Coins" color={accentOrange} />
          <ColorSwatch label="Glow" color={accentPink} />
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-condensed text-[8px] tracking-wider text-text-secondary uppercase">
        {label}
      </span>
    </div>
  );
}
