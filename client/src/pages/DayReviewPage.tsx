import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getTasksForDate, getTodayDateString, formatDuration, getCurrentHour } from '../utils/time';
import { GlassCard } from '../components/ui/GlassCard';
import { CoinBadge } from '../components/ui/CoinBadge';
import { ACTIVITY_COLORS } from '../data/demoData';

export function DayReviewPage() {
  const { state } = useApp();
  const today = getTodayDateString();
  const todayTasks = getTasksForDate(state.tasks, today);
  const currentHour = getCurrentHour();

  const plannedMinutes = todayTasks.reduce((sum, t) => sum + t.duration * 60, 0);
  const focusedMinutes = todayTasks
    .filter((t) => t.completed && ['focus', 'task'].includes(t.activityType))
    .reduce((sum, t) => sum + t.duration * 60, 0);
  const completedTasks = todayTasks.filter((t) => t.completed).length;
  const totalTasks = todayTasks.length;

  const todayEarned = state.transactions
    .filter((t) => t.amount > 0 && t.timestamp.startsWith(today))
    .reduce((sum, t) => sum + t.amount, 0);

  const missedHours = todayTasks
    .filter((t) => !t.completed && t.startHour + t.duration <= currentHour)
    .reduce((sum, t) => sum + t.duration, 0);

  const productiveBlock = todayTasks
    .filter((t) => t.completed && t.activityType === 'focus')
    .sort((a, b) => b.duration - a.duration)[0];

  const hourBars = Array.from({ length: 24 }, (_, hour) => {
    const task = todayTasks.find((t) => hour >= t.startHour && hour < t.startHour + t.duration);
    let status: 'completed' | 'missed' | 'planned' | 'rest' | 'empty' = 'empty';
    if (task) {
      if (['sleep', 'meal', 'rest', 'class', 'travel', 'personal'].includes(task.activityType)) {
        status = 'rest';
      } else if (task.completed) status = 'completed';
      else if (hour < currentHour) status = 'missed';
      else status = 'planned';
    }
    return { hour, status, task };
  });

  const barColors = {
    completed: ACTIVITY_COLORS.focus,
    missed: 'rgba(255, 90, 31, 0.3)',
    planned: 'rgba(200, 255, 0, 0.2)',
    rest: ACTIVITY_COLORS.rest,
    empty: 'rgba(255,255,255,0.05)',
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="font-condensed text-xs tracking-[0.2em] text-accent-lime">END OF DAY</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-2">DAY IN REVIEW</h1>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'PLANNED', value: formatDuration(plannedMinutes) },
          { label: 'FOCUSED', value: formatDuration(focusedMinutes) },
          { label: 'COMPLETED', value: `${completedTasks} / ${totalTasks} TASKS` },
          { label: 'EARNED', value: `+${todayEarned}`, coins: true },
          { label: 'MISSED', value: `${missedHours} HOURS` },
        ].map((stat) => (
          <GlassCard key={stat.label}>
            <p className="font-condensed text-[10px] tracking-widest text-text-secondary">{stat.label}</p>
            {stat.coins ? (
              <CoinBadge amount={todayEarned} size="lg" className="mt-2" />
            ) : (
              <p className="font-mono text-2xl font-bold mt-2">{stat.value}</p>
            )}
          </GlassCard>
        ))}
      </div>

      {productiveBlock && (
        <GlassCard className="border-accent-lime/20">
          <p className="font-condensed text-xs tracking-widest text-text-secondary">MOST PRODUCTIVE TIME</p>
          <p className="font-display text-2xl font-bold mt-2 text-accent-lime">
            {String(productiveBlock.startHour).padStart(2, '0')}:00 –{' '}
            {String(productiveBlock.startHour + productiveBlock.duration).padStart(2, '0')}:00
          </p>
          <p className="text-text-secondary text-sm mt-1">{productiveBlock.name}</p>
        </GlassCard>
      )}

      <GlassCard>
        <p className="font-condensed text-xs tracking-widest text-text-secondary mb-6">24-HOUR OVERVIEW</p>
        <div className="space-y-1">
          {hourBars.map(({ hour, status }) => (
            <div key={hour} className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-text-secondary w-10">{String(hour).padStart(2, '0')}</span>
              <div
                className="flex-1 h-3 rounded-sm"
                style={{ backgroundColor: barColors[status] }}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-6 text-xs text-text-secondary">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: barColors.completed }} /> Focused</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: barColors.rest }} /> Rest</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: barColors.missed }} /> Missed</span>
        </div>
      </GlassCard>
    </div>
  );
}
