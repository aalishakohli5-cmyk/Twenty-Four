import type {
  AppState,
  AvatarId,
  CustomThemeColors,
  ThemeId,
  UserSettings,
} from '../types';
export interface UiPrefs {
  onboardingComplete: boolean;
  hasSeenLanding: boolean;
  equippedTheme: ThemeId;
  equippedAvatar: AvatarId | null;
  customThemeColors: CustomThemeColors;
  ownedRewards: string[];
  settings: Pick<
    UserSettings,
    'colorMode' | 'reducedMotion' | 'motionIntensity' | 'soundEnabled' | 'reminders'
  >;
}

const DEFAULT_UI_PREFS: UiPrefs = {
  onboardingComplete: false,
  hasSeenLanding: false,
  equippedTheme: 'default',
  equippedAvatar: 'shinchan',
  customThemeColors: {
    accentLime: '#c8ff00',
    accentOrange: '#ff5a1f',
    accentPink: '#ff2bd6',
  },
  ownedRewards: [],
  settings: {
    colorMode: 'dark',
    reducedMotion: false,
    motionIntensity: 'full',
    soundEnabled: true,
    reminders: true,
  },
};

function getStorageKey(userId?: string | null): string {
  return userId ? `twentyfour-ui-${userId}` : 'twentyfour-ui-guest';
}

export function loadUiPrefs(userId?: string | null): UiPrefs {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return { ...DEFAULT_UI_PREFS };
    const parsed = JSON.parse(raw) as Partial<UiPrefs>;
    return {
      ...DEFAULT_UI_PREFS,
      ...parsed,
      customThemeColors: { ...DEFAULT_UI_PREFS.customThemeColors, ...parsed.customThemeColors },
      settings: { ...DEFAULT_UI_PREFS.settings, ...parsed.settings },
    };
  } catch {
    return { ...DEFAULT_UI_PREFS };
  }
}

export function saveUiPrefs(prefs: UiPrefs, userId?: string | null): void {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(prefs));
  } catch {
    console.warn('Failed to save UI preferences');
  }
}

export function extractUiPrefs(state: AppState): UiPrefs {
  return {
    onboardingComplete: state.onboardingComplete,
    hasSeenLanding: state.hasSeenLanding,
    equippedTheme: state.equippedTheme,
    equippedAvatar: state.equippedAvatar,
    customThemeColors: state.customThemeColors,
    ownedRewards: state.ownedRewards,
    settings: {
      colorMode: state.settings.colorMode,
      reducedMotion: state.settings.reducedMotion,
      motionIntensity: state.settings.motionIntensity,
      soundEnabled: state.settings.soundEnabled,
      reminders: state.settings.reminders,
    },
  };
}

export function applyUiPrefs(state: AppState, prefs: UiPrefs): AppState {
  return {
    ...state,
    onboardingComplete: prefs.onboardingComplete,
    hasSeenLanding: prefs.hasSeenLanding,
    equippedTheme: prefs.equippedTheme,
    equippedAvatar: prefs.equippedAvatar,
    customThemeColors: prefs.customThemeColors,
    ownedRewards: prefs.ownedRewards,
    settings: {
      ...state.settings,
      ...prefs.settings,
    },
  };
}
