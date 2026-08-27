import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import HourSlot from "../components/HourSlot";
import TaskModal from "../components/TaskModal";
import { api } from "../lib/api";

interface Task {
  id: string;
  title: string;
  status: string;
  startHour: number;
  durationHrs: number;
  difficulty: "SHORT" | "MEDIUM" | "DIFFICULT";
}

function potentialCoinsForHour(hour: number) {
  const isPeak = (hour >= 4 && hour < 8) || hour >= 23 || hour < 3;
  return isPeak ? 20 : 10;
}

export default function Today() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalHour, setModalHour] = useState<number | null>(null);

  const today = new Date().toISOString();

  async function loadTasks() {
    setLoading(true);
    try {
      const { tasks } = await api.get(`/api/tasks?date=${today}`);
      setTasks(tasks);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(data: {
    title: string;
    category: string;
    startHour: number;
    durationHrs: number;
    difficulty: "SHORT" | "MEDIUM" | "DIFFICULT";
  }) {
    await api.post("/api/tasks", { ...data, date: today });
    await loadTasks();
  }

  async function handleComplete(taskId: string) {
    await api.post(`/api/tasks/${taskId}/complete`);
    await loadTasks();
  }

  const tasksByHour = new Map(tasks.map((t) => [t.startHour, t]));
  const totalPotential = Array.from({ length: 24 }, (_, h) => potentialCoinsForHour(h)).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Today</h1>
            <p className="text-sm text-cream/50">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <p className="text-sm text-cream/50">
            Up to <span className="text-gold">{totalPotential}</span> coins available today
          </p>
        </div>

        {loading ? (
          <p className="text-cream/40">Loading your day...</p>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: 24 }, (_, hour) => {
              const task = tasksByHour.get(hour);
              return (
                <div key={hour} className="group relative">
                  <HourSlot
                    hour={hour}
                    task={task}
                    potentialCoins={potentialCoinsForHour(hour)}
                    onClick={() => {
                      if (task) {
                        if (task.status !== "COMPLETED") handleComplete(task.id);
                      } else {
                        setModalHour(hour);
                      }
                    }}
                  />
                  {task && task.status !== "COMPLETED" && (
                    <button
                      onClick={() => navigate("/focus", { state: { taskId: task.id, title: task.title } })}
                      className="absolute right-16 top-1/2 -translate-y-1/2 rounded-md border border-white/10 px-2 py-1 text-[10px] text-cream/50 opacity-0 transition-opacity hover:border-gold hover:text-gold group-hover:opacity-100"
                    >
                      Focus
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {modalHour !== null && (
        <TaskModal
          hour={modalHour}
          onClose={() => setModalHour(null)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
