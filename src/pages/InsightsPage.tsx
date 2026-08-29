import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getTasksForDate, getTodayDateString, formatDuration } from '../utils/time';
import { GlassCard } from '../components/ui/GlassCard';
import { ActivityHeatmap } from '../components/insights/ActivityHeatmap';
import { ACTIVITY_COLORS } from '../data/demoData';

export function InsightsPage() {
  const { state } = useApp();
  const today = getTodayDateString();
  const todayTasks = getTasksForDate(state.tasks, today);

  const plannedMinutes = todayTasks.reduce((sum, t) => sum + t.duration * 60, 0);
  const completedTasks = todayTasks.filter((t) => t.completed).length;
  const totalTasks = todayTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todayStats = state.dailyStats.find((d) => d.date === today);
  const todayFocusedMinutes = todayStats?.focusedMinutes ?? todayTasks
    .filter((t) => t.completed && t.activityType === 'focus')
    .reduce((sum, t) => sum + t.duration * 60, 0);

  const weekEarned = state.transactions
    .filter((t) => t.amount > 0)
    .slice(0, 20)
    .reduce((sum, t) => sum + t.amount, 0);

  const hourActivity = Array.from({ length: 24 }, (_, hour) => {
    const task = todayTasks.find((t) => hour >= t.startHour && hour < t.startHour + t.duration);
    return { hour, task, type: task?.activityType || 'unplanned', completed: task?.completed };
  });

  const productiveHours = todayTasks
    .filter((t) => t.activityType === 'focus' && t.completed)
    .map((t) => `${String(t.startHour).padStart(2, '0')}:00 – ${String(t.startHour + t.duration).padStart(2, '0')}:00`);

  const last7Days = state.dailyStats
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="font-condensed text-xs tracking-[0.2em] text-accent-lime">ANALYTICS</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-2">TIME REPORT</h1>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'FOCUS TODAY', value: formatDuration(todayFocusedMinutes), sub: 'tracked time' },
          { label: 'TASK COMPLETION', value: `${completionRate}%`, sub: `${completedTasks}/${totalTasks}` },
          { label: 'COINS EARNED', value: `+${weekEarned}`, sub: 'recent' },
          { label: 'PLANNING', value: formatDuration(plannedMinutes), sub: 'planned today' },
        ].map((stat) => (
          <GlassCard key={stat.label}>
            <p className="font-condensed text-[10px] tracking-widest text-text-secondary">{stat.label}</p>
            <p className="font-mono text-2xl md:text-3xl font-bold mt-2">{stat.value}</p>
            <p className="text-xs text-text-secondary mt-1">{stat.sub}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <ActivityHeatmap dailyStats={state.dailyStats} weeks={20} />
      </GlassCard>

      {last7Days.length > 0 && (
        <GlassCard>
          <p className="font-condensed text-xs tracking-widest text-text-secondary mb-6">LAST 7 DAYS</p>
          <div className="flex items-end gap-2 h-32">
            {last7Days.map((d) => {
              const max = Math.max(...last7Days.map((x) => x.focusedMinutes), 1);
              const pct = Math.max(6, (d.focusedMinutes / max) * 100);
              return (
                <div key={d.date} className="flex-1 h-full flex flex-col items-stretch gap-2 min-w-0">
                  <div className="flex-1 flex items-end w-full min-h-0">
                    <motion.div
                      className="w-full rounded-t-md bg-accent-orange min-h-[6px]"
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className="font-condensed text-[10px] text-text-secondary text-center shrink-0">
                    {d.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      <GlassCard>
        <p className="font-condensed text-xs tracking-widest text-text-secondary mb-6">TODAY&apos;S 24</p>
        <div className="flex gap-0.5 h-8 p-0.5 rounded-lg bg-slot-track border border-slot-border">
          {hourActivity.map(({ hour, type, completed }) => {
            const color = ACTIVITY_COLORS[type] || ACTIVITY_COLORS.focus;
            const isUnplanned = type === 'unplanned';
            return (
              <div
                key={hour}
                className={`flex-1 rounded-sm transition-colors min-w-0 ${
                  isUnplanned ? 'bg-slot-track border border-slot-border' : ''
                }`}
                style={
                  !isUnplanned
                    ? {
                        backgroundColor: completed ? color : `${color}66`,
                        border: completed ? undefined : `1px solid ${color}44`,
                      }
                    : undefined
                }
                title={`${hour}:00`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-accent-lime" /> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slot-track border border-slot-border" /> Unplanned
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-accent-orange/50 border border-accent-orange/30" /> Planned
          </span>
        </div>
      </GlassCard>

      <GlassCard className="border-accent-lime/20">
        <p className="font-display text-lg font-bold">
          YOU FOCUS BEST BETWEEN{' '}
          <span className="text-accent-lime">
            {productiveHours.length > 0 ? productiveHours[0] : '7PM — 10PM'}
          </span>
        </p>
        <p className="text-text-secondary text-sm mt-2">
          YOU COMPLETED {completionRate}% OF YOUR PLANNED HOURS.
        </p>
      </GlassCard>
    </div>
  );
}
