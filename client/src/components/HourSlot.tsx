interface Task {
  id: string;
  title: string;
  status: string;
  durationHrs: number;
  difficulty: "SHORT" | "MEDIUM" | "DIFFICULT";
}

interface Props {
  hour: number;
  task?: Task;
  potentialCoins: number;
  onClick: () => void;
}

function formatHour(h: number) {
  const period = h < 12 ? "AM" : "PM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}${period}`;
}

export default function HourSlot({ hour, task, potentialCoins, onClick }: Props) {
  const isPeak = (hour >= 4 && hour < 8) || hour >= 23 || hour < 3;

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
        task
          ? task.status === "COMPLETED"
            ? "border-gold/40 bg-gold/10"
            : "border-white/15 bg-panel"
          : "border-white/5 bg-panel/40 hover:border-white/20"
      }`}
    >
      <span className="w-14 shrink-0 text-xs text-cream/50">{formatHour(hour)}</span>
      <div className="flex-1">
        {task ? (
          <>
            <p className="text-sm font-medium">{task.title}</p>
            <p className="text-xs text-cream/50">
              {task.durationHrs}h · {task.difficulty.toLowerCase()} · {task.status.toLowerCase()}
            </p>
          </>
        ) : (
          <p className="text-sm text-cream/30">Empty slot</p>
        )}
      </div>
      <span className={`text-xs font-semibold ${isPeak ? "text-gold" : "text-cream/40"}`}>
        +{potentialCoins}c
      </span>
    </button>
  );
}
