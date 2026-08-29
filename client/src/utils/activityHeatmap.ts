import type { DailyStats } from '../types';

export interface HeatmapCell {
  date: string;
  day: number;
  week: number;
  minutes: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function getFocusLevel(minutes: number): 0 | 1 | 2 | 3 | 4 {
  if (minutes <= 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 120) return 3;
  return 4;
}

export function addDailyFocus(
  dailyStats: DailyStats[],
  date: string,
  focusMinutes: number,
  earnedCoins: number
): DailyStats[] {
  const idx = dailyStats.findIndex((d) => d.date === date);
  if (idx >= 0) {
    const next = [...dailyStats];
    next[idx] = {
      ...next[idx],
      focusedMinutes: next[idx].focusedMinutes + focusMinutes,
      earnedCoins: next[idx].earnedCoins + earnedCoins,
    };
    return next;
  }
  return [
    ...dailyStats,
    {
      date,
      plannedMinutes: 0,
      focusedMinutes: focusMinutes,
      completedTasks: 0,
      totalTasks: 0,
      earnedCoins,
      missedHours: 0,
    },
  ];
}

export function buildActivityHeatmap(dailyStats: DailyStats[], weeks = 20): HeatmapCell[] {
  const map = new Map(dailyStats.map((d) => [d.date, d.focusedMinutes]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - (weeks * 7 - 1));
  start.setDate(start.getDate() - start.getDay());

  const cells: HeatmapCell[] = [];
  const cursor = new Date(start);

  while (cursor <= today) {
    const date = cursor.toISOString().split('T')[0];
    const minutes = map.get(date) ?? 0;
    cells.push({
      date,
      day: cursor.getDay(),
      week: Math.floor((cursor.getTime() - start.getTime()) / (7 * 86400000)),
      minutes,
      level: getFocusLevel(minutes),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return cells;
}

export function getHeatmapWeekCount(cells: HeatmapCell[]): number {
  if (cells.length === 0) return 0;
  return Math.max(...cells.map((c) => c.week)) + 1;
}

export function formatHeatmapDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function createDemoDailyStats(days = 140): DailyStats[] {
  const stats: DailyStats[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const date = d.toISOString().split('T')[0];
    const roll = Math.random();
    const focusedMinutes =
      roll > 0.25 ? Math.floor(Math.random() * 150) + (roll > 0.7 ? 60 : 10) : 0;

    if (focusedMinutes > 0) {
      stats.push({
        date,
        plannedMinutes: focusedMinutes + Math.floor(Math.random() * 60),
        focusedMinutes,
        completedTasks: Math.floor(Math.random() * 4) + 1,
        totalTasks: Math.floor(Math.random() * 3) + 4,
        earnedCoins: Math.floor(focusedMinutes / 6) * 10,
        missedHours: Math.floor(Math.random() * 2),
      });
    }
  }

  return stats;
}
