import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";

interface Report {
  plannedHours: number;
  completedHours: number;
  focusedMinutes: number;
  coinsEarned: number;
  tasksCompleted: number;
  tasksTotal: number;
  mostProductiveHour: number | null;
}

function formatHour(h: number) {
  const period = h < 12 ? "AM" : "PM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}${period}`;
}

export default function DailyReport() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    api.get(`/api/reports/daily?date=${new Date().toISOString()}`).then(setReport);
  }, []);

  const stats = report
    ? [
        { label: "Planned hours", value: report.plannedHours },
        { label: "Completed hours", value: report.completedHours },
        { label: "Focused minutes", value: report.focusedMinutes },
        { label: "Coins earned", value: `${report.coinsEarned}c` },
        { label: "Tasks completed", value: `${report.tasksCompleted}/${report.tasksTotal}` },
        {
          label: "Most productive hour",
          value: report.mostProductiveHour !== null ? formatHour(report.mostProductiveHour) : "—",
        },
      ]
    : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold">Daily report</h1>

        {!report ? (
          <p className="text-cream/40">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-panel p-5">
                <p className="mb-1 text-xs text-cream/50">{s.label}</p>
                <p className="text-xl font-semibold">{s.value}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
