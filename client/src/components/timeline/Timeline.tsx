import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../../types';
import { getCurrentHour, getTasksForDate, getTodayDateString, formatTime } from '../../utils/time';
import { HourSlot } from './HourSlot';
import { useCurrentTime } from '../../hooks/useFocusTimer';

interface TimelineProps {
  tasks: Task[];
  date?: string;
  onHourClick?: (hour: number, task?: Task) => void;
  compact?: boolean;
  showIndicator?: boolean;
}

export function Timeline({
  tasks,
  date = getTodayDateString(),
  onHourClick,
  compact = false,
  showIndicator = true,
}: TimelineProps) {
  const currentHour = getCurrentHour();
  const now = useCurrentTime();
  const currentRef = useRef<HTMLDivElement>(null);
  const dayTasks = getTasksForDate(tasks, date);

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const getTaskForHour = (hour: number): Task | undefined => {
    return dayTasks.find((t) => hour >= t.startHour && hour < t.startHour + t.duration);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="relative">
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="sticky top-0 z-10 mb-4 py-3 px-4 glass-card rounded-xl flex items-center gap-4"
        >
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent-lime/50 to-transparent relative">
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent-lime glow-lime"
                style={{ left: `${((now.getHours() * 60 + now.getMinutes()) / 1440) * 100}%` }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
          </div>
          <span className="font-condensed text-xs tracking-widest text-accent-lime whitespace-nowrap">
            NOW {formatTime(now)}
          </span>
        </motion.div>
      )}

      <div className={`flex flex-col ${compact ? 'gap-2' : 'gap-3'}`}>
        {hours.map((hour) => {
          const task = getTaskForHour(hour);
          const isCurrent = hour === currentHour;
          const isPast = hour < currentHour;

          return (
            <div key={hour} ref={isCurrent ? currentRef : undefined}>
              <HourSlot
                hour={hour}
                task={task}
                isCurrent={isCurrent}
                isPast={isPast}
                onClick={() => onHourClick?.(hour, task)}
                compact={compact}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
