import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type {
  AppState,
  Task,
  ToastMessage,
  ThemeId,
  RestDay,
  UserSettings,
  UserProfile,
  CustomThemeColors,
  AvatarId,
} from '../types';
import { useAuth } from './AuthContext';
import {
  createInitialState,
  createTransaction,
  createFocusSession,
  STORE_ITEMS,
} from '../data/demoData';
import { applyEquippedTheme, resolveColorMode } from '../lib/themeTokens';
import { addDailyFocus } from '../utils/activityHeatmap';
import {
  loadState,
  saveState,
  generateId,
  getTodayDateString,
  validateTask,
  categoryToActivityType,
  getCompletionBonus,
  getDifficulty,
  calculateFocusEarned,
  getTasksForDate,
  getPotentialCoinsForTask,
} from '../utils/time';
import type { TaskCategory } from '../types';

type Action =
  | { type: 'HYDRATE'; payload: AppState }
  | { type: 'SET_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'RESCHEDULE_TASK'; payload: { id: string; startHour: number } }
  | { type: 'START_FOCUS'; payload: Task }
  | { type: 'PAUSE_FOCUS' }
  | { type: 'RESUME_FOCUS' }
  | { type: 'UPDATE_FOCUS_EARNED'; payload: number }
  | { type: 'END_FOCUS'; payload: { earned: number; completed: boolean; focusMinutes: number } }
  | { type: 'ADD_COINS'; payload: { amount: number; description: string; type?: 'earn' | 'bonus' | 'decay'; icon?: string } }
  | { type: 'SPEND_COINS'; payload: { amount: number; description: string; itemId: string } }
  | { type: 'UNLOCK_REWARD'; payload: string }
  | { type: 'EQUIP_THEME'; payload: ThemeId }
  | { type: 'EQUIP_AVATAR'; payload: AvatarId | null }
  | { type: 'SET_CUSTOM_THEME_COLORS'; payload: CustomThemeColors }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'ADD_REST_DAY'; payload: RestDay }
  | { type: 'REMOVE_REST_DAY'; payload: string }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'SET_LANDING_SEEN' }
  | { type: 'RESET_DEMO' }
  | { type: 'RESET_FRESH' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;

    case 'SET_PROFILE':
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
          initials: (action.payload.name || state.profile.name)
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
        },
      };

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
        focusSession:
          state.focusSession?.taskId === action.payload ? null : state.focusSession,
      };

    case 'COMPLETE_TASK': {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (!task || task.completed) return state;
      const difficulty = getDifficulty(task.duration, task.category);
      const bonus = getCompletionBonus(difficulty);
      const tx = createTransaction(bonus, `Completed: ${task.name}`, 'earn', 'task');
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, completed: true } : t
        ),
        walletBalance: state.walletBalance + bonus,
        transactions: [tx, ...state.transactions],
      };
    }

    case 'RESCHEDULE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id
            ? { ...t, startHour: action.payload.startHour, completed: false }
            : t
        ),
      };

    case 'START_FOCUS':
      return { ...state, focusSession: createFocusSession(action.payload) };

    case 'PAUSE_FOCUS':
      if (!state.focusSession || state.focusSession.status !== 'active') return state;
      return {
        ...state,
        focusSession: {
          ...state.focusSession,
          status: 'paused',
          pausedAt: Date.now(),
        },
      };

    case 'RESUME_FOCUS':
      if (!state.focusSession || state.focusSession.status !== 'paused') return state;
      const pausedDuration = state.focusSession.pausedAt
        ? Date.now() - state.focusSession.pausedAt
        : 0;
      return {
        ...state,
        focusSession: {
          ...state.focusSession,
          status: 'active',
          pausedAt: null,
          totalPausedMs: state.focusSession.totalPausedMs + pausedDuration,
        },
      };

    case 'UPDATE_FOCUS_EARNED':
      if (!state.focusSession) return state;
      return {
        ...state,
        focusSession: { ...state.focusSession, earnedCoins: action.payload },
      };

    case 'END_FOCUS': {
      const { earned, completed, focusMinutes } = action.payload;
      const tx = earned > 0
        ? createTransaction(earned, `Focus: ${state.focusSession?.taskName}`, 'earn', 'focus')
        : null;
      const today = getTodayDateString();
      return {
        ...state,
        focusSession: null,
        walletBalance: state.walletBalance + earned,
        transactions: tx ? [tx, ...state.transactions] : state.transactions,
        dailyStats:
          focusMinutes > 0
            ? addDailyFocus(state.dailyStats, today, focusMinutes, earned)
            : state.dailyStats,
        tasks: completed && state.focusSession
          ? state.tasks.map((t) =>
              t.id === state.focusSession!.taskId ? { ...t, completed: true } : t
            )
          : state.tasks,
      };
    }

    case 'ADD_COINS': {
      const tx = createTransaction(
        action.payload.amount,
        action.payload.description,
        action.payload.type || 'earn',
        action.payload.icon
      );
      return {
        ...state,
        walletBalance: state.walletBalance + action.payload.amount,
        transactions: [tx, ...state.transactions],
      };
    }

    case 'SPEND_COINS': {
      const tx = createTransaction(
        -action.payload.amount,
        action.payload.description,
        'spend',
        'store'
      );
      return {
        ...state,
        walletBalance: state.walletBalance - action.payload.amount,
        transactions: [tx, ...state.transactions],
        ownedRewards: [...state.ownedRewards, action.payload.itemId],
      };
    }

    case 'UNLOCK_REWARD':
      return {
        ...state,
        ownedRewards: state.ownedRewards.includes(action.payload)
          ? state.ownedRewards
          : [...state.ownedRewards, action.payload],
      };

    case 'EQUIP_THEME':
      return { ...state, equippedTheme: action.payload };

    case 'EQUIP_AVATAR':
      return { ...state, equippedAvatar: action.payload };

    case 'SET_CUSTOM_THEME_COLORS':
      return { ...state, customThemeColors: action.payload };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'ADD_REST_DAY':
      return {
        ...state,
        restDays: [
          ...state.restDays.filter((r) => r.date !== action.payload.date),
          action.payload,
        ],
      };

    case 'REMOVE_REST_DAY':
      return {
        ...state,
        restDays: state.restDays.filter((r) => r.date !== action.payload),
      };

    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingComplete: true };

    case 'SET_LANDING_SEEN':
      return { ...state, hasSeenLanding: true };

    case 'RESET_DEMO':
      return createInitialState(true);

    case 'RESET_FRESH':
      return createInitialState(false);

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  addTask: (data: {
    name: string;
    category: TaskCategory;
    startHour: number;
    duration: number;
  }) => string | null;
  updateTask: (task: Task) => string | null;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => number;
  rescheduleTask: (id: string, startHour: number) => string | null;
  startFocus: (taskId: string) => void;
  pauseFocus: () => void;
  resumeFocus: () => void;
  endFocus: (markComplete?: boolean) => number;
  getFocusElapsed: () => number;
  purchaseItem: (itemId: string) => string | null;
  equipTheme: (themeId: ThemeId) => void;
  equipAvatar: (avatarId: AvatarId | null) => void;
  setCustomThemeColors: (colors: CustomThemeColors) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addRestDay: (restDay: RestDay) => void;
  removeRestDay: (date: string) => void;
  completeOnboarding: () => void;
  setLandingSeen: () => void;
  resetDemo: () => void;
  resetFresh: () => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type'], amount?: number) => void;
  dismissToast: (id: string) => void;
  todayTasks: Task[];
  potentialCoinsRemaining: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.uid ?? null;
  const prevUserId = useRef<string | null | undefined>(undefined);

  const [state, dispatch] = useReducer(reducer, null, () => {
    const saved = loadState(userId);
    return saved || createInitialState(false);
  });
  const [toasts, setToasts] = useReducer(
    (current: ToastMessage[], action: { type: 'add'; toast: ToastMessage } | { type: 'dismiss'; id: string }) => {
      if (action.type === 'add') return [...current, action.toast].slice(-5);
      return current.filter((t) => t.id !== action.id);
    },
    []
  );

  useEffect(() => {
    if (prevUserId.current === userId) return;
    prevUserId.current = userId;

    const saved = loadState(userId);
    if (saved) {
      dispatch({ type: 'HYDRATE', payload: saved });
    } else if (user) {
      dispatch({
        type: 'HYDRATE',
        payload: {
          ...createInitialState(false),
          profile: {
            name: user.displayName || 'User',
            avatar: user.photoURL || '',
            initials: (user.displayName || 'U')
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase(),
            email: user.email || undefined,
            googleId: user.uid,
          },
        },
      });
    }
  }, [userId, user]);

  useEffect(() => {
    if (user) {
      dispatch({
        type: 'SET_PROFILE',
        payload: {
          name: user.displayName,
          avatar: user.photoURL,
          email: user.email,
          googleId: user.uid,
        },
      });
    }
  }, [user?.uid, user?.displayName, user?.photoURL, user?.email]);

  useEffect(() => {
    saveState(state, userId);
  }, [state, userId]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.equippedTheme);

    const colorMode = resolveColorMode(state.settings.colorMode);
    document.documentElement.setAttribute('data-color-mode', colorMode);

    if (state.settings.reducedMotion) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduced-motion');
    }

    applyEquippedTheme(
      document.documentElement,
      state.equippedTheme,
      colorMode,
      state.customThemeColors
    );
  }, [state.equippedTheme, state.customThemeColors, state.settings.reducedMotion, state.settings.colorMode]);

  useEffect(() => {
    if (state.settings.colorMode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      const colorMode = mq.matches ? 'light' : 'dark';
      document.documentElement.setAttribute('data-color-mode', colorMode);
      applyEquippedTheme(
        document.documentElement,
        state.equippedTheme,
        colorMode,
        state.customThemeColors
      );
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [state.settings.colorMode, state.equippedTheme, state.customThemeColors]);

  const addToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'info', amount?: number) => {
      const toast: ToastMessage = { id: generateId(), message, type, amount };
      setToasts({ type: 'add', toast });
      setTimeout(() => setToasts({ type: 'dismiss', id: toast.id }), 3500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts({ type: 'dismiss', id });
  }, []);

  const today = getTodayDateString();
  const todayTasks = getTasksForDate(state.tasks, today);

  const potentialCoinsRemaining = todayTasks
    .filter((t) => !t.completed)
    .reduce((sum, t) => sum + getPotentialCoinsForTask(t, state.settings.coinRate), 0);

  const addTask = useCallback(
    (data: { name: string; category: TaskCategory; startHour: number; duration: number }) => {
      const activityType = categoryToActivityType(data.category, data.name);
      const taskData = {
        name: data.name.trim(),
        category: data.category,
        startHour: data.startHour,
        duration: data.duration,
        activityType,
        date: today,
      };
      const error = validateTask(state.tasks, taskData as Omit<Task, 'id' | 'createdAt' | 'completed'>);
      if (error) return error;

      const task: Task = {
        ...taskData,
        id: generateId(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_TASK', payload: task });
      return null;
    },
    [state.tasks, today]
  );

  const updateTask = useCallback(
    (task: Task) => {
      const error = validateTask(state.tasks, task, task.id);
      if (error) return error;
      dispatch({ type: 'UPDATE_TASK', payload: task });
      return null;
    },
    [state.tasks]
  );

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const completeTask = useCallback(
    (id: string) => {
      const task = state.tasks.find((t) => t.id === id);
      if (!task || task.completed) return 0;
      const bonus = getCompletionBonus(getDifficulty(task.duration, task.category));
      dispatch({ type: 'COMPLETE_TASK', payload: id });
      return bonus;
    },
    [state.tasks]
  );

  const rescheduleTask = useCallback(
    (id: string, startHour: number) => {
      const task = state.tasks.find((t) => t.id === id);
      if (!task) return 'Task not found';
      const updated = { ...task, startHour, completed: false };
      const error = validateTask(state.tasks, updated, id);
      if (error) return error;
      dispatch({ type: 'RESCHEDULE_TASK', payload: { id, startHour } });
      return null;
    },
    [state.tasks]
  );

  const startFocus = useCallback(
    (taskId: string) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) dispatch({ type: 'START_FOCUS', payload: task });
    },
    [state.tasks]
  );

  const getFocusElapsed = useCallback(() => {
    if (!state.focusSession) return 0;
    const { startedAt, totalPausedMs, pausedAt, status } = state.focusSession;
    if (status === 'paused' && pausedAt) {
      return Math.floor((pausedAt - startedAt - totalPausedMs) / 1000);
    }
    return Math.floor((Date.now() - startedAt - totalPausedMs) / 1000);
  }, [state.focusSession]);

  const pauseFocus = useCallback(() => dispatch({ type: 'PAUSE_FOCUS' }), []);
  const resumeFocus = useCallback(() => dispatch({ type: 'RESUME_FOCUS' }), []);

  const endFocus = useCallback(
    (markComplete = false) => {
      if (!state.focusSession) return 0;
      const elapsed = getFocusElapsed();
      const earned = calculateFocusEarned(elapsed, state.settings.coinRate);
      const focusMinutes = Math.max(1, Math.floor(elapsed / 60));
      dispatch({
        type: 'END_FOCUS',
        payload: { earned, completed: markComplete, focusMinutes: elapsed >= 60 ? focusMinutes : 0 },
      });
      return earned;
    },
    [state.focusSession, getFocusElapsed, state.settings.coinRate]
  );

  const purchaseItem = useCallback(
    (itemId: string) => {
      const item = STORE_ITEMS.find((i) => i.id === itemId);
      if (!item) return 'Item not found';
      if (state.ownedRewards.includes(itemId)) return 'Already owned';
      if (state.walletBalance < item.price) return 'Not enough coins';

      dispatch({
        type: 'SPEND_COINS',
        payload: { amount: item.price, description: item.name, itemId },
      });
      return null;
    },
    [state.ownedRewards, state.walletBalance]
  );

  const equipTheme = useCallback(
    (themeId: ThemeId) => {
      if (themeId !== 'default') {
        const itemId = themeId === 'custom' ? 'theme-custom' : `theme-${themeId}`;
        if (!state.ownedRewards.includes(itemId)) return;
      }
      dispatch({ type: 'EQUIP_THEME', payload: themeId });
    },
    [state.ownedRewards]
  );

  const equipAvatar = useCallback(
    (avatarId: AvatarId | null) => {
      if (avatarId === null) {
        dispatch({ type: 'EQUIP_AVATAR', payload: null });
        return;
      }
      if (avatarId !== 'shinchan') {
        const itemId = `avatar-${avatarId}`;
        if (!state.ownedRewards.includes(itemId)) return;
      }
      dispatch({ type: 'EQUIP_AVATAR', payload: avatarId });
    },
    [state.ownedRewards]
  );

  const setCustomThemeColors = useCallback((colors: CustomThemeColors) => {
    dispatch({ type: 'SET_CUSTOM_THEME_COLORS', payload: colors });
  }, []);

  const updateSettings = useCallback((settings: Partial<UserSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    dispatch({ type: 'SET_PROFILE', payload: profile });
  }, []);

  const addRestDay = useCallback((restDay: RestDay) => {
    dispatch({ type: 'ADD_REST_DAY', payload: restDay });
  }, []);

  const removeRestDay = useCallback((date: string) => {
    dispatch({ type: 'REMOVE_REST_DAY', payload: date });
  }, []);

  const completeOnboarding = useCallback(() => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  }, []);

  const setLandingSeen = useCallback(() => {
    dispatch({ type: 'SET_LANDING_SEEN' });
  }, []);

  const resetDemo = useCallback(() => {
    dispatch({ type: 'RESET_DEMO' });
  }, []);

  const resetFresh = useCallback(() => {
    dispatch({ type: 'RESET_FRESH' });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        rescheduleTask,
        startFocus,
        pauseFocus,
        resumeFocus,
        endFocus,
        getFocusElapsed,
        purchaseItem,
        equipTheme,
        equipAvatar,
        setCustomThemeColors,
        updateSettings,
        updateProfile,
        addRestDay,
        removeRestDay,
        completeOnboarding,
        setLandingSeen,
        resetDemo,
        resetFresh,
        toasts,
        addToast,
        dismissToast,
        todayTasks,
        potentialCoinsRemaining,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
