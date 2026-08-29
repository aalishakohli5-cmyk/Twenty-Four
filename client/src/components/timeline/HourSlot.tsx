import { motion } from 'framer-motion';
import type { Task } from '../../types';
import {
  formatHour,
  getPotentialCoinsForHour,
  isMultiplierHour,
} from '../../utils/time';
import { ACTIVITY_COLORS, ACTIVITY_LABELS } from '../../data/demoData';
import { useApp } from '../../context/AppContext';
import { CoinBadge } from '../ui/CoinBadge';
import { Check, Zap } from 'lucide-react';

interface HourSlotProps {
  hour: number;
  task?: Task;
  isCurrent: boolean;
  isPast: boolean;
  onClick?: () => void;
  compact?: boolean;
}

function timeLabelClass(isCurrent: boolean, isPast: boolean, hasTask: boolean) {
  if (isCurrent) return 'text-slot-current font-semibold';
  if (hasTask) return 'text-slot-text';
  if (isPast) return 'text-slot-text-muted';
  return 'text-slot-text font-medium';
}

export function HourSlot({ hour, task, isCurrent, isPast, onClick, compact }: HourSlotProps) {
  const { state } = useApp();
  const coinRate = state.settings.coinRate;
  const activityType = task?.activityType || 'unplanned';
  const color = ACTIVITY_COLORS[activityType] || ACTIVITY_COLORS.unplanned;
  const usesAccent = activityType === 'focus' || activityType === 'task';
  const coins = task
    ? getPotentialCoinsForHour(hour, activityType, coinRate)
    : getPotentialCoinsForHour(hour, 'focus', coinRate);

  const slotClass = task
    ? isCurrent
      ? 'slot-card slot-current'
      : 'slot-card'
    : isCurrent
      ? 'slot-card slot-current'
      : isPast
        ? 'slot-card slot-past'
        : 'slot-card slot-open';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      className={`
        relative w-full text-left rounded-xl border transition-all duration-300
        ${compact ? 'p-3' : 'p-4 md:p-5'}
        ${slotClass}
        hover:-translate-y-0.5
        ${task?.completed ? 'opacity-85' : ''}
      `}
    >
      {isCurrent && (
        <div className="absolute -left-px top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-lime rounded-r" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`font-mono text-sm tabular-nums tracking-wide ${timeLabelClass(isCurrent, isPast, !!task)}`}>
            {formatHour(hour)}
          </span>
          {isMultiplierHour(hour) && !task && (
            <span className="font-condensed text-[10px] tracking-wider px-2 py-0.5 rounded bg-accent-orange/25 text-accent-orange border border-accent-orange/30">
              2X
            </span>
          )}
          {isCurrent && (
            <span className="slot-now-badge font-condensed text-[10px] tracking-widest animate-pulse">
              NOW
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {task?.completed && <Check className="w-4 h-4 text-accent-lime" />}
          {coins > 0 && <CoinBadge amount={coins} size="sm" />}
          {coins === 0 && task && (
            <span className="font-condensed text-[10px] text-slot-text-muted tracking-wider">REST</span>
          )}
        </div>
      </div>

      {task ? (
        <div className="mt-2">
          <p className={`font-medium truncate ${task.completed ? 'line-through text-slot-text-muted' : 'text-slot-text'}`}>
            {task.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: usesAccent ? 'var(--accent-lime)' : color }}
            />
            <span className="font-condensed text-[10px] tracking-wider text-slot-text-muted">
              {ACTIVITY_LABELS[activityType]}
            </span>
          </div>
          {coins > 0 && (
            <div className="mt-2 h-1 rounded-full bg-slot-track overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: usesAccent ? 'var(--accent-lime)' : color }}
                initial={{ width: 0 }}
                animate={{ width: task.completed ? '100%' : isPast ? '30%' : '0%' }}
                transition={{ duration: 0.6 }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className={`mt-2 flex items-center gap-2 ${isPast ? 'text-slot-text-muted' : 'text-slot-open-label font-medium'}`}>
          <Zap className={`w-3.5 h-3.5 shrink-0 ${isPast ? 'opacity-70' : 'opacity-90'}`} />
          <span className="font-condensed text-xs tracking-wider uppercase">
            {isPast ? 'PASSED · TAP TO PLAN' : 'OPEN SLOT · TAP TO PLAN'}
          </span>
        </div>
      )}
    </motion.button>
  );
}
