import type { AppState, Task, TaskCategory, ActivityType, Difficulty } from '../types';
import { DEFAULT_SETTINGS } from '../data/demoData';

export const STORAGE_KEY = 'twentyfour_app_state';
export const GUEST_STORAGE_KEY = 'twentyfour_app_state_guest';

export function getStorageKey(userId?: string | null): string {
  return userId ? `${STORAGE_KEY}_${userId}` : GUEST_STORAGE_KEY;
}

export function getTodayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatDateDisplay(date: Date = new Date()): {
  day: string;
  date: string;
  month: string;
  year: string;
} {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
  ];
  return {
    day: days[date.getDay()],
    date: String(date.getDate()).padStart(2, '0'),
    month: months[date.getMonth()],
    year: String(date.getFullYear()),
  };
}

export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function getCurrentHour(): number {
  return new Date().getHours();
}

export function getHoursLeft(): number {
  const now = new Date();
  const hoursLeft = 24 - now.getHours() - (now.getMinutes() > 0 ? 1 : 0);
  return Math.max(0, hoursLeft);
}

export function formatHour(hour: number): string {
  return String(hour).padStart(2, '0') + ':00';
}

export function hourRangeLabel(startHour: number, duration: number): string {
  const endHour = (startHour + duration) % 24;
  return `${formatHour(startHour)} → ${formatHour(endHour)}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function categoryToActivityType(category: TaskCategory, name: string): ActivityType {
  const lower = name.toLowerCase();
  if (lower.includes('sleep') || lower.includes('nap')) return 'sleep';
  if (lower.includes('lunch') || lower.includes('breakfast') || lower.includes('dinner') || lower.includes('meal')) return 'meal';
  if (lower.includes('class') || lower.includes('lecture')) return 'class';
  if (lower.includes('travel') || lower.includes('commute')) return 'travel';
  if (lower.includes('rest') || lower.includes('relax')) return 'rest';
  if (category === 'Exercise' || category === 'Personal') return 'personal';
  if (category === 'Study' || category === 'Work' || category === 'Creative') return 'focus';
  return 'task';
}

export function getDifficulty(duration: number, category: TaskCategory): Difficulty {
  if (duration >= 2 || category === 'Study' || category === 'Work') return 'hard';
  if (duration >= 1) return 'medium';
  return 'short';
}

export function getCompletionBonus(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'short': return 5;
    case 'medium': return 10;
    case 'hard': return 20;
  }
}

export function getFocusCoinsPerHour(): number {
  return 10;
}

export function isMultiplierHour(hour: number): boolean {
  return (hour >= 4 && hour <= 8) || hour >= 23 || hour <= 3;
}

export function getHourMultiplier(hour: number): number {
  return isMultiplierHour(hour) ? 2 : 1;
}

export function getPotentialCoinsForHour(
  hour: number,
  activityType: ActivityType,
  coinRate = getFocusCoinsPerHour()
): number {
  if (['sleep', 'meal', 'rest', 'travel', 'class', 'personal', 'unplanned'].includes(activityType)) {
    return 0;
  }
  return coinRate * getHourMultiplier(hour);
}

export function getPotentialCoinsForTask(task: Task, coinRate = getFocusCoinsPerHour()): number {
  let total = 0;
  for (let i = 0; i < task.duration; i++) {
    const hour = (task.startHour + i) % 24;
    total += getPotentialCoinsForHour(hour, task.activityType, coinRate);
  }
  const difficulty = getDifficulty(task.duration, task.category);
  total += getCompletionBonus(difficulty);
  return total;
}

export function tasksOverlap(a: Task, b: Task): boolean {
  if (a.date !== b.date) return false;
  const aStart = a.startHour;
  const aEnd = a.startHour + a.duration;
  const bStart = b.startHour;
  const bEnd = b.startHour + b.duration;
  return aStart < bEnd && bStart < aEnd;
}

export function validateTask(
  tasks: Task[],
  task: Omit<Task, 'id' | 'createdAt' | 'completed'>,
  excludeId?: string
): string | null {
  if (!task.name.trim()) return 'Task name is required';
  if (task.duration < 1 || task.duration > 12) return 'Duration must be between 1 and 12 hours';
  if (task.startHour < 0 || task.startHour > 23) return 'Invalid start time';

  const newTask = { ...task, id: excludeId || 'temp' } as Task;
  for (const existing of tasks) {
    if (existing.id === excludeId) continue;
    if (existing.date !== task.date) continue;
    if (tasksOverlap(existing, newTask)) {
      return `Overlaps with "${existing.name}" at ${formatHour(existing.startHour)}`;
    }
  }
  return null;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

export function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function calculateFocusEarned(elapsedSeconds: number, coinRate = 10): number {
  return Math.floor((elapsedSeconds / 3600) * coinRate);
}

export function getTasksForDate(tasks: Task[], date: string): Task[] {
  return tasks.filter((t) => t.date === date).sort((a, b) => a.startHour - b.startHour);
}

export function getTaskAtHour(tasks: Task[], date: string, hour: number): Task | undefined {
  return getTasksForDate(tasks, date).find(
    (t) => hour >= t.startHour && hour < t.startHour + t.duration
  );
}

export function loadState(userId?: string | null): AppState | null {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    return {
      ...parsed,
      customThemeColors: parsed.customThemeColors ?? {
        accentLime: '#c8ff00',
        accentOrange: '#ff5a1f',
        accentPink: '#ff2bd6',
      },
      dailyStats: parsed.dailyStats ?? [],
      equippedAvatar: parsed.equippedAvatar ?? 'shinchan',
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
    };
  } catch {
    return null;
  }
}

export function saveState(state: AppState, userId?: string | null): void {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(state));
  } catch {
    console.warn('Failed to save state');
  }
}
