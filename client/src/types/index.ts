export type ActivityType =
  | 'focus'
  | 'task'
  | 'sleep'
  | 'meal'
  | 'class'
  | 'travel'
  | 'personal'
  | 'rest'
  | 'unplanned';

export type TaskCategory =
  | 'Study'
  | 'Work'
  | 'Personal'
  | 'Exercise'
  | 'Creative'
  | 'Other';

export type RestDayType =
  | 'rest'
  | 'holiday'
  | 'travel'
  | 'exam-break'
  | 'personal';

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  startHour: number;
  duration: number;
  activityType: ActivityType;
  completed: boolean;
  createdAt: string;
  date: string;
}

export interface FocusSession {
  id: string;
  taskId: string;
  taskName: string;
  startedAt: number;
  pausedAt: number | null;
  totalPausedMs: number;
  status: 'active' | 'paused' | 'completed';
  earnedCoins: number;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'earn' | 'spend' | 'decay' | 'bonus';
  timestamp: string;
  icon?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'themes' | 'backgrounds' | 'taskbars' | 'sounds' | 'avatars' | 'animations';
  themeId?: ThemeId;
  avatarId?: AvatarId;
  preview: string;
  order: number;
}

export type ThemeId = 'default' | 'midnight-grid' | 'neon-city' | 'orbital' | 'custom';

export type AvatarId = 'shinchan' | 'sakura' | 'kenji' | 'neko' | 'pulse';

export interface CustomThemeColors {
  accentLime: string;
  accentOrange: string;
  accentPink: string;
}

export interface RestDay {
  date: string;
  type: RestDayType;
  label: string;
}

export type ColorMode = 'dark' | 'light' | 'system';

export interface UserSettings {
  coinRate: number;
  reminders: boolean;
  decayEnabled: boolean;
  decayRate: number;
  soundEnabled: boolean;
  motionIntensity: 'full' | 'reduced' | 'none';
  reducedMotion: boolean;
  colorMode: ColorMode;
}

export interface UserProfile {
  name: string;
  avatar: string;
  initials: string;
  email?: string;
  googleId?: string;
}

export interface DailyStats {
  date: string;
  plannedMinutes: number;
  focusedMinutes: number;
  completedTasks: number;
  totalTasks: number;
  earnedCoins: number;
  missedHours: number;
}

export interface AppState {
  profile: UserProfile;
  tasks: Task[];
  focusSession: FocusSession | null;
  walletBalance: number;
  transactions: Transaction[];
  ownedRewards: string[];
  equippedTheme: ThemeId;
  equippedAvatar: AvatarId | null;
  customThemeColors: CustomThemeColors;
  settings: UserSettings;
  restDays: RestDay[];
  streak: number;
  lastActiveDate: string;
  onboardingComplete: boolean;
  hasSeenLanding: boolean;
  demoMode: boolean;
  dailyStats: DailyStats[];
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'coins';
  amount?: number;
}

export type Difficulty = 'short' | 'medium' | 'hard';
