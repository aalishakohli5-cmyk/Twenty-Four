import type { AppState, Task, Transaction, FocusSession, RestDay, ThemeId, CustomThemeColors } from '../types';
import { generateId, getTodayDateString } from '../utils/time';
import { createDemoDailyStats } from '../utils/activityHeatmap';

export const DEFAULT_SETTINGS: AppState['settings'] = {
  coinRate: 10,
  reminders: true,
  decayEnabled: false,
  decayRate: 0.02,
  soundEnabled: false,
  motionIntensity: 'full',
  reducedMotion: false,
  colorMode: 'dark',
};

export const DEFAULT_CUSTOM_THEME_COLORS: CustomThemeColors = {
  accentLime: '#c8ff00',
  accentOrange: '#ff5a1f',
  accentPink: '#ff2bd6',
};

export const DEFAULT_PROFILE: AppState['profile'] = {
  name: 'TM',
  avatar: '',
  initials: 'TM',
};

export function createDemoTasks(date: string): Task[] {
  const items: Array<Omit<Task, 'id' | 'createdAt' | 'date'>> = [
    { name: 'Morning Revision', category: 'Study', startHour: 8, duration: 1, activityType: 'focus', completed: true },
    { name: 'Physics Class', category: 'Study', startHour: 10, duration: 2, activityType: 'class', completed: false },
    { name: 'Lunch', category: 'Personal', startHour: 13, duration: 1, activityType: 'meal', completed: false },
    { name: 'React Practice', category: 'Study', startHour: 15, duration: 2, activityType: 'focus', completed: false },
    { name: 'Gym', category: 'Exercise', startHour: 18, duration: 1, activityType: 'personal', completed: false },
    { name: 'Deep Study', category: 'Study', startHour: 20, duration: 2, activityType: 'focus', completed: false },
    { name: 'Reading', category: 'Personal', startHour: 22, duration: 1, activityType: 'rest', completed: false },
  ];

  return items.map((item) => ({
    ...item,
    id: generateId(),
    date,
    createdAt: new Date().toISOString(),
  }));
}

export function createDemoTransactions(): Transaction[] {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  return [
    {
      id: generateId(),
      amount: 20,
      description: 'Focus session',
      type: 'earn',
      timestamp: now.toISOString(),
      icon: 'focus',
    },
    {
      id: generateId(),
      amount: 10,
      description: 'Task completed',
      type: 'earn',
      timestamp: new Date(now.getTime() - 3600000).toISOString(),
      icon: 'task',
    },
    {
      id: generateId(),
      amount: 25,
      description: 'Daily plan bonus',
      type: 'bonus',
      timestamp: new Date(now.getTime() - 7200000).toISOString(),
      icon: 'bonus',
    },
    {
      id: generateId(),
      amount: -500,
      description: 'Neon City theme',
      type: 'spend',
      timestamp: yesterday.toISOString(),
      icon: 'store',
    },
    {
      id: generateId(),
      amount: 15,
      description: 'Morning revision',
      type: 'earn',
      timestamp: new Date(now.getTime() - 14400000).toISOString(),
      icon: 'focus',
    },
  ];
}

export function createInitialState(demoMode = true): AppState {
  const today = getTodayDateString();

  if (demoMode) {
    return {
      profile: DEFAULT_PROFILE,
      tasks: createDemoTasks(today),
      focusSession: null,
      walletBalance: 860,
      transactions: createDemoTransactions(),
      ownedRewards: ['theme-midnight-grid'],
      equippedTheme: 'default',
      equippedAvatar: 'shinchan',
      customThemeColors: DEFAULT_CUSTOM_THEME_COLORS,
      settings: DEFAULT_SETTINGS,
      restDays: [],
      streak: 7,
      lastActiveDate: today,
      onboardingComplete: true,
      hasSeenLanding: true,
      demoMode: true,
      dailyStats: createDemoDailyStats(140),
    };
  }

  return {
    profile: DEFAULT_PROFILE,
    tasks: [],
    focusSession: null,
    walletBalance: 0,
    transactions: [],
    ownedRewards: [],
    equippedTheme: 'default',
    equippedAvatar: 'shinchan',
    customThemeColors: DEFAULT_CUSTOM_THEME_COLORS,
    settings: DEFAULT_SETTINGS,
    restDays: [],
    streak: 0,
    lastActiveDate: today,
    onboardingComplete: false,
    hasSeenLanding: false,
    demoMode: false,
    dailyStats: [],
  };
}

export function createTransaction(
  amount: number,
  description: string,
  type: Transaction['type'],
  icon?: string
): Transaction {
  return {
    id: generateId(),
    amount,
    description,
    type,
    timestamp: new Date().toISOString(),
    icon,
  };
}

export function createFocusSession(task: Task): FocusSession {
  return {
    id: generateId(),
    taskId: task.id,
    taskName: task.name,
    startedAt: Date.now(),
    pausedAt: null,
    totalPausedMs: 0,
    status: 'active',
    earnedCoins: 0,
  };
}

export const STORE_ITEMS = [
  {
    id: 'theme-default',
    name: 'MINIMAL',
    description: 'Black canvas in dark · clean white in light. Mint + coral glows flip with your mode.',
    price: 0,
    category: 'themes' as const,
    themeId: 'default' as ThemeId,
    preview: 'default',
    order: 0,
  },
  {
    id: 'theme-midnight-grid',
    name: 'MIDNIGHT GRID',
    description: 'Orange cinematic warmth on deep charcoal.',
    price: 200,
    category: 'themes' as const,
    themeId: 'midnight-grid' as ThemeId,
    preview: 'midnight-grid',
    order: 1,
  },
  {
    id: 'theme-neon-city',
    name: 'NEON CITY',
    description: 'Electric neon green, hot pink, and cyan glow.',
    price: 500,
    category: 'themes' as const,
    themeId: 'neon-city' as ThemeId,
    preview: 'neon-city',
    order: 2,
  },
  {
    id: 'theme-orbital',
    name: 'ORBITAL',
    description: 'Purple cosmic depth for deep focus.',
    price: 1000,
    category: 'themes' as const,
    themeId: 'orbital' as ThemeId,
    preview: 'orbital',
    order: 3,
  },
  {
    id: 'theme-custom',
    name: 'CUSTOM PALETTE',
    description: 'Pick your own accent colors with color wheels.',
    price: 50000,
    category: 'themes' as const,
    themeId: 'custom' as ThemeId,
    preview: 'custom',
    order: 4,
  },
  {
    id: 'avatar-shinchan',
    name: 'SHINCHAN',
    description: 'Free mischief buddy — follows your cursor while you grind.',
    price: 0,
    category: 'avatars' as const,
    avatarId: 'shinchan' as const,
    preview: 'shinchan',
    order: 10,
  },
  {
    id: 'avatar-sakura',
    name: 'SAKURA',
    description: 'Cherry-blossom anime study partner. Soft focus energy.',
    price: 300,
    category: 'avatars' as const,
    avatarId: 'sakura' as const,
    preview: 'sakura',
    order: 11,
  },
  {
    id: 'avatar-kenji',
    name: 'KENJI',
    description: 'Headphones-on hacker student. Late-night grind mode.',
    price: 450,
    category: 'avatars' as const,
    avatarId: 'kenji' as const,
    preview: 'kenji',
    order: 12,
  },
  {
    id: 'avatar-neko',
    name: 'NEKO',
    description: 'Cat student with notebook. Cozy library vibes.',
    price: 600,
    category: 'avatars' as const,
    avatarId: 'neko' as const,
    preview: 'neko',
    order: 13,
  },
  {
    id: 'avatar-pulse',
    name: 'PULSE',
    description: 'Neon focus bot — power, coins, and deep work.',
    price: 900,
    category: 'avatars' as const,
    avatarId: 'pulse' as const,
    preview: 'pulse',
    order: 14,
  },
];

export const THEMES = [
  { id: 'default' as ThemeId, name: 'MINIMAL', description: 'Inverts with light/dark · mint + coral glows' },
  { id: 'midnight-grid' as ThemeId, name: 'MIDNIGHT GRID', description: 'Orange cinematic' },
  { id: 'neon-city' as ThemeId, name: 'NEON CITY', description: 'Neon green + hot pink + cyan' },
  { id: 'orbital' as ThemeId, name: 'ORBITAL', description: 'Purple cosmic' },
  { id: 'custom' as ThemeId, name: 'CUSTOM PALETTE', description: 'Your colors, your vibe' },
];

export const REST_DAY_OPTIONS: Array<{ type: RestDay['type']; label: string }> = [
  { type: 'rest', label: 'REST DAY' },
  { type: 'holiday', label: 'HOLIDAY' },
  { type: 'travel', label: 'TRAVEL' },
  { type: 'exam-break', label: 'EXAM BREAK' },
  { type: 'personal', label: 'PERSONAL DAY' },
];

export const ACTIVITY_COLORS: Record<string, string> = {
  focus: '#C8FF00',
  task: '#C8FF00',
  sleep: '#6366F1',
  meal: '#FFB347',
  class: '#60A5FA',
  travel: '#94A3B8',
  personal: '#FF2BD6',
  rest: '#A78BFA',
  unplanned: '#3F3F3F',
};

export const ACTIVITY_LABELS: Record<string, string> = {
  focus: 'FOCUS',
  task: 'TASK',
  sleep: 'SLEEP',
  meal: 'MEAL',
  class: 'CLASS',
  travel: 'TRAVEL',
  personal: 'PERSONAL',
  rest: 'REST',
  unplanned: 'OPEN',
};
