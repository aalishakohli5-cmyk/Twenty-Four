import type { ThemeId, CustomThemeColors, ColorMode } from '../types';

export interface ThemeTokens {
  accentLime: string;
  accentOrange: string;
  accentPink: string;
  glowLime: string;
  glowOrange: string;
  border: string;
  glowHero1: string;
  glowHero2: string;
  glowHeroSpot: string;
  textGlow?: string;
}

export const THEME_TOKENS: Record<Exclude<ThemeId, 'custom'>, ThemeTokens> = {
  default: {
    accentLime: '#f4f4f4',
    accentOrange: '#ff6b4a',
    accentPink: '#7dffb2',
    glowLime: 'rgba(244, 244, 244, 0.14)',
    glowOrange: 'rgba(255, 107, 74, 0.18)',
    border: 'rgba(255, 255, 255, 0.14)',
    glowHero1: 'rgba(125, 255, 178, 0.14)',
    glowHero2: 'rgba(255, 107, 74, 0.12)',
    glowHeroSpot: 'rgba(255, 255, 255, 0.07)',
  },
  'midnight-grid': {
    accentLime: '#ff5a1f',
    accentOrange: '#ffb347',
    accentPink: '#ff2bd6',
    glowLime: 'rgba(255, 90, 31, 0.2)',
    glowOrange: 'rgba(255, 179, 71, 0.2)',
    border: 'rgba(255, 90, 31, 0.12)',
    glowHero1: 'rgba(255, 90, 31, 0.14)',
    glowHero2: 'rgba(180, 30, 30, 0.1)',
    glowHeroSpot: 'rgba(255, 90, 31, 0.12)',
  },
  'neon-city': {
    accentLime: '#39ff14',
    accentOrange: '#ff10f0',
    accentPink: '#00ffff',
    glowLime: 'rgba(57, 255, 20, 0.4)',
    glowOrange: 'rgba(255, 16, 240, 0.35)',
    border: 'rgba(57, 255, 20, 0.14)',
    glowHero1: 'rgba(57, 255, 20, 0.16)',
    glowHero2: 'rgba(255, 16, 240, 0.14)',
    glowHeroSpot: 'rgba(0, 255, 255, 0.12)',
    textGlow:
      '0 0 12px rgba(57, 255, 20, 0.8), 0 0 32px rgba(57, 255, 20, 0.45), 0 0 48px rgba(0, 255, 255, 0.2)',
  },
  orbital: {
    accentLime: '#b388ff',
    accentOrange: '#ff2bd6',
    accentPink: '#7c4dff',
    glowLime: 'rgba(179, 136, 255, 0.2)',
    glowOrange: 'rgba(255, 43, 214, 0.2)',
    border: 'rgba(179, 136, 255, 0.12)',
    glowHero1: 'rgba(179, 136, 255, 0.14)',
    glowHero2: 'rgba(255, 43, 214, 0.1)',
    glowHeroSpot: 'rgba(124, 77, 255, 0.12)',
  },
};

type ResolvedColorMode = 'light' | 'dark';

interface SurfacePreset {
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  textPrimary: string;
  textSecondary: string;
  paperTint: string;
  paperLine: string;
  paperOpacity: string;
  paperPanelBg: string;
  grainOpacity: string;
  studyIconOpacity: string;
  studyDecoOpacity: string;
  slotBg: string;
  slotBorder: string;
  slotOpenBg: string;
  slotOpenBorder: string;
  slotText: string;
  slotTextMuted: string;
  slotOpenLabel: string;
  slotTrack: string;
  bgAtmosphere: string;
  border: string;
  glowHero1: string;
  glowHero2: string;
  glowHeroSpot: string;
  glowLime: string;
  glowOrange: string;
}

const DARK_BASE: Omit<SurfacePreset, 'bgAtmosphere' | 'border' | 'glowHero1' | 'glowHero2' | 'glowHeroSpot' | 'glowLime' | 'glowOrange' | 'slotOpenBg' | 'slotOpenBorder'> = {
  bgPrimary: '#000000',
  bgSecondary: '#0a0a0a',
  bgCard: 'rgba(12, 12, 12, 0.78)',
  textPrimary: '#ffffff',
  textSecondary: '#b3b3b3',
  paperTint: '#f5ead6',
  paperLine: 'rgba(245, 234, 214, 0.08)',
  paperOpacity: '0.055',
  paperPanelBg: 'rgba(16, 15, 14, 0.72)',
  grainOpacity: '0.03',
  studyIconOpacity: '0.12',
  studyDecoOpacity: '0.4',
  slotBg: 'rgba(255, 255, 255, 0.06)',
  slotBorder: 'rgba(255, 255, 255, 0.16)',
  slotText: 'rgba(255, 255, 255, 0.94)',
  slotTextMuted: 'rgba(255, 255, 255, 0.72)',
  slotOpenLabel: 'rgba(255, 255, 255, 0.88)',
  slotTrack: 'rgba(255, 255, 255, 0.1)',
};

const LIGHT_BASE: Omit<SurfacePreset, 'bgAtmosphere' | 'border' | 'glowHero1' | 'glowHero2' | 'glowHeroSpot' | 'glowLime' | 'glowOrange' | 'slotOpenBg' | 'slotOpenBorder'> = {
  bgPrimary: '#faf6ef',
  bgSecondary: '#f0ebe3',
  bgCard: 'rgba(255, 252, 245, 0.92)',
  textPrimary: '#111111',
  textSecondary: '#525252',
  paperTint: '#fff9f0',
  paperLine: 'rgba(60, 50, 40, 0.08)',
  paperOpacity: '0.14',
  paperPanelBg: 'rgba(255, 252, 245, 0.88)',
  grainOpacity: '0.022',
  studyIconOpacity: '0.16',
  studyDecoOpacity: '0.55',
  slotBg: 'rgba(255, 255, 255, 0.95)',
  slotBorder: 'rgba(0, 0, 0, 0.12)',
  slotText: 'rgba(10, 10, 10, 0.94)',
  slotTextMuted: 'rgba(10, 10, 10, 0.72)',
  slotOpenLabel: 'rgba(10, 10, 10, 0.82)',
  slotTrack: 'rgba(0, 0, 0, 0.08)',
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return null;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function rgba(hex: string, alpha: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function scaleRgba(value: string, scale: number) {
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) return value;
  const parts = match[1].split(',').map((p) => p.trim());
  if (parts.length === 4) {
    const alpha = parseFloat(parts[3]) * scale;
    return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha.toFixed(3)})`;
  }
  return value;
}

export function colorsToTokens(colors: CustomThemeColors): ThemeTokens {
  return {
    accentLime: colors.accentLime,
    accentOrange: colors.accentOrange,
    accentPink: colors.accentPink,
    glowLime: rgba(colors.accentLime, 0.35),
    glowOrange: rgba(colors.accentOrange, 0.35),
    border: rgba(colors.accentLime, 0.18),
    glowHero1: rgba(colors.accentPink, 0.14),
    glowHero2: rgba(colors.accentOrange, 0.12),
    glowHeroSpot: rgba(colors.accentLime, 0.1),
  };
}

export function getThemeTokens(themeId: ThemeId, customColors?: CustomThemeColors): ThemeTokens {
  if (themeId === 'custom') {
    return colorsToTokens(customColors ?? {
      accentLime: '#c8ff00',
      accentOrange: '#ff5a1f',
      accentPink: '#ff2bd6',
    });
  }
  return THEME_TOKENS[themeId];
}

export function resolveColorMode(colorMode: ColorMode): ResolvedColorMode {
  if (colorMode === 'system') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return colorMode;
}

function getGlowScale(themeId: ThemeId, light: boolean): number {
  if (!light) return 1;
  if (themeId === 'neon-city' || themeId === 'midnight-grid') return 1.2;
  if (themeId === 'orbital') return 1;
  return 0.85;
}

function getTextGlowVar(
  themeId: ThemeId,
  colorMode: ResolvedColorMode,
  accents: ThemeTokens
): string {
  if (themeId === 'neon-city') {
    return colorMode === 'light'
      ? '0 0 6px rgba(57, 255, 20, 0.35), 0 0 14px rgba(57, 255, 20, 0.12)'
      : '0 0 10px rgba(57, 255, 20, 0.55), 0 0 22px rgba(57, 255, 20, 0.2)';
  }

  if (themeId === 'midnight-grid') {
    return colorMode === 'light'
      ? '0 0 8px rgba(255, 90, 31, 0.3), 0 2px 0 rgba(0, 0, 0, 0.06)'
      : '0 0 18px rgba(255, 90, 31, 0.35), 0 0 32px rgba(255, 179, 71, 0.15)';
  }

  if (themeId === 'default') {
    return colorMode === 'light'
      ? '0 1px 0 rgba(0, 0, 0, 0.1)'
      : '0 0 16px rgba(125, 255, 178, 0.25), 0 0 28px rgba(255, 255, 255, 0.06)';
  }

  if (themeId === 'orbital') {
    return colorMode === 'light'
      ? `0 0 12px ${accents.glowLime}`
      : `0 0 20px ${accents.glowLime}`;
  }

  return colorMode === 'light' ? 'none' : `0 0 16px ${accents.glowLime}`;
}

function buildSurfacePreset(themeId: ThemeId, colorMode: ResolvedColorMode, tokens: ThemeTokens): SurfacePreset {
  const light = colorMode === 'light';
  const base = light ? LIGHT_BASE : DARK_BASE;
  const glowScale = getGlowScale(themeId, light);

  const accent = tokens.accentLime;
  const accent2 = tokens.accentOrange;

  const presets: Record<ThemeId, { dark: Partial<SurfacePreset>; light: Partial<SurfacePreset> }> = {
    default: {
      dark: {
        bgPrimary: '#000000',
        bgSecondary: '#0a0a0a',
        bgCard: 'rgba(12, 12, 12, 0.78)',
        textPrimary: '#ffffff',
        textSecondary: '#b3b3b3',
        paperTint: '#f5ead6',
        paperLine: 'rgba(245, 234, 214, 0.08)',
        slotBg: 'rgba(255, 255, 255, 0.06)',
        slotBorder: 'rgba(255, 255, 255, 0.16)',
        slotText: 'rgba(255, 255, 255, 0.92)',
        slotTextMuted: 'rgba(255, 255, 255, 0.58)',
        slotOpenLabel: 'rgba(255, 255, 255, 0.72)',
        slotTrack: 'rgba(255, 255, 255, 0.1)',
        bgAtmosphere:
          'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(125, 255, 178, 0.06) 0%, rgba(255, 107, 74, 0.04) 42%, transparent 72%)',
        slotOpenBg: 'rgba(255, 255, 255, 0.08)',
        slotOpenBorder: 'rgba(255, 255, 255, 0.22)',
        border: 'rgba(255, 255, 255, 0.14)',
      },
      light: {
        bgPrimary: '#ffffff',
        bgSecondary: '#f5f5f5',
        bgCard: 'rgba(255, 255, 255, 0.96)',
        textPrimary: '#0a0a0a',
        textSecondary: '#525252',
        paperTint: '#0a0a0a',
        paperLine: 'rgba(0, 0, 0, 0.07)',
        paperOpacity: '0.1',
        paperPanelBg: 'rgba(255, 255, 255, 0.92)',
        slotBg: 'rgba(0, 0, 0, 0.04)',
        slotBorder: 'rgba(0, 0, 0, 0.12)',
        slotText: 'rgba(0, 0, 0, 0.92)',
        slotTextMuted: 'rgba(0, 0, 0, 0.55)',
        slotOpenLabel: 'rgba(0, 0, 0, 0.68)',
        slotTrack: 'rgba(0, 0, 0, 0.08)',
        bgAtmosphere:
          'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(125, 255, 178, 0.12) 0%, rgba(255, 107, 74, 0.08) 42%, transparent 72%)',
        glowHero1: 'rgba(125, 255, 178, 0.14)',
        glowHero2: 'rgba(255, 107, 74, 0.12)',
        glowHeroSpot: 'rgba(255, 107, 74, 0.08)',
        glowLime: 'rgba(255, 107, 74, 0.18)',
        glowOrange: 'rgba(255, 107, 74, 0.22)',
        border: 'rgba(0, 0, 0, 0.12)',
        slotOpenBg: 'rgba(255, 255, 255, 0.98)',
        slotOpenBorder: 'rgba(255, 107, 74, 0.32)',
      },
    },
    'midnight-grid': {
      dark: {
        bgPrimary: '#0a0604',
        bgSecondary: '#120a06',
        bgAtmosphere:
          'radial-gradient(ellipse at 30% 0%, rgba(255, 90, 31, 0.08) 0%, rgba(180, 30, 30, 0.04) 50%, transparent 75%)',
        slotOpenBg: 'rgba(255, 90, 31, 0.1)',
        slotOpenBorder: 'rgba(255, 90, 31, 0.28)',
      },
      light: {
        bgPrimary: '#fff8f5',
        bgSecondary: '#fff0eb',
        bgCard: 'rgba(255, 252, 250, 0.96)',
        textPrimary: '#1a0a04',
        bgAtmosphere:
          'radial-gradient(ellipse at 30% 0%, rgba(255, 90, 31, 0.16) 0%, rgba(255, 179, 71, 0.08) 50%, transparent 75%)',
        glowHero1: 'rgba(255, 90, 31, 0.18)',
        glowHero2: 'rgba(255, 179, 71, 0.14)',
        glowHeroSpot: 'rgba(255, 90, 31, 0.12)',
        glowLime: 'rgba(255, 90, 31, 0.28)',
        glowOrange: 'rgba(255, 179, 71, 0.24)',
        border: 'rgba(255, 90, 31, 0.28)',
        studyIconOpacity: '0.22',
        slotOpenBg: 'rgba(255, 255, 255, 0.98)',
        slotOpenBorder: 'rgba(255, 90, 31, 0.38)',
      },
    },
    'neon-city': {
      dark: {
        bgPrimary: '#040804',
        bgSecondary: '#080f08',
        bgAtmosphere:
          'radial-gradient(ellipse at 50% 0%, rgba(255, 16, 240, 0.06) 0%, rgba(57, 255, 20, 0.04) 45%, transparent 70%)',
        slotOpenBg: 'rgba(57, 255, 20, 0.1)',
        slotOpenBorder: 'rgba(57, 255, 20, 0.28)',
      },
      light: {
        bgPrimary: '#f0fff4',
        bgSecondary: '#e6ffec',
        bgCard: 'rgba(245, 255, 247, 0.96)',
        textPrimary: '#041204',
        bgAtmosphere:
          'radial-gradient(ellipse at 50% 0%, rgba(57, 255, 20, 0.14) 0%, rgba(255, 16, 240, 0.1) 45%, rgba(0, 255, 255, 0.06) 70%, transparent 85%)',
        glowHero1: 'rgba(57, 255, 20, 0.22)',
        glowHero2: 'rgba(255, 16, 240, 0.18)',
        glowHeroSpot: 'rgba(0, 255, 255, 0.14)',
        glowLime: 'rgba(57, 255, 20, 0.42)',
        glowOrange: 'rgba(255, 16, 240, 0.32)',
        border: 'rgba(57, 255, 20, 0.32)',
        studyIconOpacity: '0.26',
        slotOpenBg: 'rgba(255, 255, 255, 0.98)',
        slotOpenBorder: 'rgba(57, 255, 20, 0.38)',
      },
    },
    orbital: {
      dark: {
        bgPrimary: '#08060c',
        bgSecondary: '#100c14',
        bgAtmosphere:
          'radial-gradient(ellipse at 70% 10%, rgba(179, 136, 255, 0.08) 0%, rgba(255, 43, 214, 0.05) 45%, transparent 70%)',
        slotOpenBg: 'rgba(179, 136, 255, 0.1)',
        slotOpenBorder: 'rgba(179, 136, 255, 0.28)',
      },
      light: {
        bgPrimary: '#f8f5fc',
        bgSecondary: '#f0ebf8',
        bgCard: 'rgba(252, 249, 255, 0.94)',
        bgAtmosphere:
          'radial-gradient(ellipse at 70% 10%, rgba(179, 136, 255, 0.1) 0%, rgba(255, 43, 214, 0.05) 45%, transparent 70%)',
        glowHero1: 'rgba(179, 136, 255, 0.1)',
        glowHero2: 'rgba(255, 43, 214, 0.07)',
        glowHeroSpot: 'rgba(124, 77, 255, 0.07)',
        glowLime: 'rgba(179, 136, 255, 0.14)',
        glowOrange: 'rgba(255, 43, 214, 0.12)',
        border: 'rgba(179, 136, 255, 0.18)',
        slotOpenBg: 'rgba(255, 255, 255, 0.98)',
        slotOpenBorder: 'rgba(179, 136, 255, 0.32)',
      },
    },
    custom: {
      dark: {
        bgAtmosphere: `radial-gradient(ellipse 120% 80% at 50% -10%, ${tokens.glowHero1} 0%, ${tokens.glowHero2} 42%, transparent 72%)`,
        slotOpenBg: rgba(accent, 0.1),
        slotOpenBorder: rgba(accent, 0.28),
      },
      light: {
        bgAtmosphere: `radial-gradient(ellipse 120% 80% at 50% -10%, ${scaleRgba(tokens.glowHero1, 0.65)} 0%, ${scaleRgba(tokens.glowHero2, 0.65)} 42%, transparent 72%)`,
        border: rgba(accent, light ? 0.16 : 0.18),
        slotOpenBg: rgba(accent, 0.07),
        slotOpenBorder: rgba(accent, 0.28),
      },
    },
  };

  const themeOverrides = presets[themeId][colorMode];

  return {
    ...base,
    border: light ? 'rgba(0, 0, 0, 0.1)' : tokens.border,
    glowHero1: scaleRgba(tokens.glowHero1, glowScale),
    glowHero2: scaleRgba(tokens.glowHero2, glowScale),
    glowHeroSpot: scaleRgba(tokens.glowHeroSpot, glowScale),
    glowLime: scaleRgba(tokens.glowLime, glowScale),
    glowOrange: scaleRgba(tokens.glowOrange, glowScale),
    slotOpenBg: light ? 'rgba(255, 255, 255, 0.98)' : rgba(accent, 0.14),
    slotOpenBorder: light ? rgba(accent2, 0.32) : rgba(accent, 0.38),
    bgAtmosphere: `radial-gradient(ellipse 120% 80% at 50% -10%, ${scaleRgba(tokens.glowHero1, glowScale)} 0%, ${scaleRgba(tokens.glowHero2, glowScale)} 42%, transparent 72%)`,
    ...themeOverrides,
  };
}

function getReadableAccents(
  themeId: ThemeId,
  colorMode: ResolvedColorMode,
  tokens: ThemeTokens
): ThemeTokens & { accentLimeFg: string } {
  if (colorMode === 'dark') {
    if (themeId === 'default') {
      return {
        ...tokens,
        accentLime: '#f4f4f4',
        accentOrange: '#ff6b4a',
        accentPink: '#7dffb2',
        accentLimeFg: '#000000',
      };
    }
    return { ...tokens, accentLimeFg: '#000000' };
  }

  // Light mode — minimal inverts black↔white; neon & grid stay vivid
  const lightAccents: Record<Exclude<ThemeId, 'custom'>, ThemeTokens & { accentLimeFg: string }> = {
    default: {
      ...tokens,
      accentLime: '#0a0a0a',
      accentOrange: '#ff6b4a',
      accentPink: '#2d6a4f',
      glowLime: 'rgba(255, 107, 74, 0.2)',
      glowOrange: 'rgba(255, 107, 74, 0.25)',
      border: 'rgba(0, 0, 0, 0.12)',
      glowHero1: 'rgba(125, 255, 178, 0.14)',
      glowHero2: 'rgba(255, 107, 74, 0.12)',
      glowHeroSpot: 'rgba(255, 107, 74, 0.1)',
      accentLimeFg: '#ffffff',
    },
    'midnight-grid': {
      ...tokens,
      accentLime: '#ff5a1f',
      accentOrange: '#ffb347',
      accentPink: '#ff2bd6',
      glowLime: 'rgba(255, 90, 31, 0.3)',
      glowOrange: 'rgba(255, 179, 71, 0.28)',
      border: 'rgba(255, 90, 31, 0.28)',
      glowHero1: 'rgba(255, 90, 31, 0.18)',
      glowHero2: 'rgba(255, 179, 71, 0.14)',
      accentLimeFg: '#000000',
    },
    'neon-city': {
      ...tokens,
      accentLime: '#39ff14',
      accentOrange: '#ff10f0',
      accentPink: '#00ffff',
      glowLime: 'rgba(57, 255, 20, 0.45)',
      glowOrange: 'rgba(255, 16, 240, 0.38)',
      border: 'rgba(57, 255, 20, 0.35)',
      glowHero1: 'rgba(57, 255, 20, 0.22)',
      glowHero2: 'rgba(255, 16, 240, 0.18)',
      glowHeroSpot: 'rgba(0, 255, 255, 0.16)',
      textGlow:
        '0 0 12px rgba(57, 255, 20, 0.95), 0 0 32px rgba(57, 255, 20, 0.55), 0 0 48px rgba(0, 255, 255, 0.28)',
      accentLimeFg: '#000000',
    },
    orbital: {
      ...tokens,
      accentLime: '#7c3aed',
      accentOrange: '#db2777',
      accentPink: '#6d28d9',
      glowLime: 'rgba(124, 58, 237, 0.25)',
      glowOrange: 'rgba(219, 39, 119, 0.22)',
      border: 'rgba(124, 58, 237, 0.22)',
      accentLimeFg: '#ffffff',
    },
  };

  if (themeId !== 'custom') {
    return lightAccents[themeId];
  }

  const darkenHex = (hex: string, factor = 0.55) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const lum = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    if (lum < 0.45) return hex;
    return `rgb(${Math.round(rgb.r * factor)}, ${Math.round(rgb.g * factor)}, ${Math.round(rgb.b * factor)})`;
  };

  return {
    ...tokens,
    accentLime: darkenHex(tokens.accentLime),
    accentOrange: darkenHex(tokens.accentOrange),
    accentPink: darkenHex(tokens.accentPink),
    border: 'rgba(0, 0, 0, 0.14)',
    accentLimeFg: '#ffffff',
  };
}

export function getThemeCssVars(
  themeId: ThemeId,
  colorMode: ResolvedColorMode,
  customColors?: CustomThemeColors
): Record<string, string> {
  const baseTokens = getThemeTokens(themeId, customColors);
  const accents = getReadableAccents(themeId, colorMode, baseTokens);
  const surfaces = buildSurfacePreset(themeId, colorMode, accents);

  return {
    '--accent-lime': accents.accentLime,
    '--accent-orange': accents.accentOrange,
    '--accent-pink': accents.accentPink,
    '--accent-lime-fg': accents.accentLimeFg,
    '--text-glow': getTextGlowVar(themeId, colorMode, accents),
    '--glow-lime': surfaces.glowLime,
    '--glow-orange': surfaces.glowOrange,
    '--border': surfaces.border,
    '--glow-hero-1': surfaces.glowHero1,
    '--glow-hero-2': surfaces.glowHero2,
    '--glow-hero-spot': surfaces.glowHeroSpot,
    '--bg-atmosphere': surfaces.bgAtmosphere,
    '--color-accent-lime': accents.accentLime,
    '--color-accent-orange': accents.accentOrange,
    '--color-accent-pink': accents.accentPink,
    '--bg-primary': surfaces.bgPrimary,
    '--bg-secondary': surfaces.bgSecondary,
    '--bg-card': surfaces.bgCard,
    '--text-primary': surfaces.textPrimary,
    '--text-secondary': surfaces.textSecondary,
    '--paper-tint': surfaces.paperTint,
    '--paper-line': surfaces.paperLine,
    '--paper-opacity': surfaces.paperOpacity,
    '--paper-panel-bg': surfaces.paperPanelBg,
    '--grain-opacity': surfaces.grainOpacity,
    '--study-icon-opacity': surfaces.studyIconOpacity,
    '--study-deco-opacity': surfaces.studyDecoOpacity,
    '--slot-bg': surfaces.slotBg,
    '--slot-border': surfaces.slotBorder,
    '--slot-open-bg': surfaces.slotOpenBg,
    '--slot-open-border': surfaces.slotOpenBorder,
    '--slot-text': surfaces.slotText,
    '--slot-text-muted': surfaces.slotTextMuted,
    '--slot-open-label': surfaces.slotOpenLabel,
    '--slot-track': surfaces.slotTrack,
    '--slot-current-text': surfaces.textPrimary,
  };
}

export function applyEquippedTheme(
  el: HTMLElement,
  themeId: ThemeId,
  colorMode: ResolvedColorMode,
  customColors?: CustomThemeColors
) {
  const vars = getThemeCssVars(themeId, colorMode, customColors);
  Object.entries(vars).forEach(([key, value]) => {
    el.style.setProperty(key, value);
  });
}

export function getThemeTextGlow(
  themeId: ThemeId,
  customColors?: CustomThemeColors,
  colorMode: ResolvedColorMode = 'dark'
): string {
  const accents = getReadableAccents(themeId, colorMode, getThemeTokens(themeId, customColors));
  return getTextGlowVar(themeId, colorMode, accents);
}
