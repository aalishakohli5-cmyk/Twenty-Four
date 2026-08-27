import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";

export default function FocusMode() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { taskId?: string; title?: string } | undefined;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<{ coinsEarned: number; focusedMins: number } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  async function start() {
    const { session } = await api.post("/api/focus/start", { taskId: state?.taskId });
    setSessionId(session.id);
    setRunning(true);
    setSeconds(0);
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  async function finish() {
    if (!sessionId) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    const { coinsEarned, focusedMins } = await api.post(`/api/focus/${sessionId}/end`);
    setResult({ coinsEarned, focusedMins });
  }

  function formatTime(total: number) {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
        <p className="mb-1 text-sm text-cream/50">Currently focusing on</p>
        <h1 className="mb-8 text-xl font-semibold">{state?.title ?? "Untitled session"}</h1>

        <div className="mb-8 text-6xl font-mono tabular-nums text-gold">
          {formatTime(seconds)}
        </div>

        {result ? (
          <div className="w-full rounded-2xl border border-gold/30 bg-gold/10 p-6">
            <p className="mb-1 text-2xl font-semibold text-gold">+{result.coinsEarned} coins</p>
            <p className="mb-6 text-sm text-cream/60">{result.focusedMins} minutes focused</p>
            <button
              onClick={() => navigate("/today")}
              className="w-full rounded-lg bg-gold py-2.5 text-sm font-medium text-ink"
            >
              Back to Today
            </button>
          </div>
        ) : !running ? (
          <button
            onClick={start}
            className="w-full rounded-lg bg-gold py-3 text-sm font-medium text-ink"
          >
            Start focus session
          </button>
        ) : (
          <button
            onClick={finish}
            className="w-full rounded-lg border border-coral py-3 text-sm font-medium text-coral"
          >
            End session
          </button>
        )}
      </main>
    </div>
  );
}
