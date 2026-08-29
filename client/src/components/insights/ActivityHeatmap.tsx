import { buildActivityHeatmap, formatHeatmapDate } from '../../utils/activityHeatmap';
import type { DailyStats } from '../../types';

const LEVEL_CLASSES: Record<number, string> = {
  0: 'bg-slot-track border border-slot-border',
  1: 'bg-accent-lime/30',
  2: 'bg-accent-lime/50',
  3: 'bg-accent-lime/75',
  4: 'bg-accent-lime',
};

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

interface ActivityHeatmapProps {
  dailyStats: DailyStats[];
  weeks?: number;
  className?: string;
}

export function ActivityHeatmap({ dailyStats, weeks = 20, className = '' }: ActivityHeatmapProps) {
  const cells = buildActivityHeatmap(dailyStats, weeks);
  const totalMinutes = cells.reduce((sum, c) => sum + c.minutes, 0);
  const activeDays = cells.filter((c) => c.minutes > 0).length;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div>
          <p className="font-condensed text-xs tracking-widest text-text-secondary">FOCUS ACTIVITY</p>
          <p className="text-sm text-text-secondary mt-1">
            {Math.round(totalMinutes / 60)}h focused across {activeDays} days
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={`w-3 h-3 rounded-sm ${LEVEL_CLASSES[level]}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-2 min-w-full">
          <div className="flex flex-col gap-1 pt-0 shrink-0 w-8">
            {DAY_LABELS.map((label, i) => (
              <span key={i} className="h-3 text-[9px] text-text-secondary leading-3">
                {label}
              </span>
            ))}
          </div>

          <div
            className="grid gap-1"
            style={{
              gridTemplateRows: 'repeat(7, 12px)',
              gridAutoFlow: 'column',
              gridAutoColumns: '12px',
            }}
          >
            {cells.map((cell) => (
              <span
                key={cell.date}
                style={{ gridRow: cell.day + 1 }}
                title={`${formatHeatmapDate(cell.date)} · ${cell.minutes} min focused`}
                className={`w-3 h-3 rounded-sm ${LEVEL_CLASSES[cell.level]} transition-transform hover:scale-125 hover:ring-1 hover:ring-accent-lime/50`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
