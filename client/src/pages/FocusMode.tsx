import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

// Estimate only — the real total is always recomputed server-side when the
// session ends, so a clock drift or tab-throttle here can never inflate
// what actually gets credited.
const ESTIMATED_COINS_PER_HOUR = 10;

export default function FocusMode() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { taskId?: string; title?: string } | undefined;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [mintPulse, setMintPulse] = useState(false);
  const [result, setResult] = useState<{ coinsEarned: number; focusedMins: number } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMinuteRef = useRef(0);

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
    lastMinuteRef.current = 0;
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        if (Math.floor(next / 60) > lastMinuteRef.current) {
          lastMinuteRef.current = Math.floor(next / 60);
          setMintPulse(true);
          setTimeout(() => setMintPulse(false), 700);
        }
        return next;
      });
    }, 1000);
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

  const estimatedCoins = Math.floor((seconds / 3600) * ESTIMATED_COINS_PER_HOUR);
  const handRotation = ((seconds % 60) / 60) * 360;
  const coinsPile = Math.min(Math.floor(seconds / 60), 8);

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes tf-breathe {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.06); opacity: 0.8; }
        }
        @keyframes tf-mint {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-28px) scale(1.3); opacity: 0; }
        }
        .tf-breathe { animation: tf-breathe 3.4s ease-in-out infinite; }
        .tf-mint { animation: tf-mint 0.7s ease-out forwards; }
      `}</style>

      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-14 text-center">
        <p className="mb-1 text-sm text-cream/50">
          {result ? "Session complete" : running ? "Focusing on" : "Ready to focus on"}
        </p>
        <h1 className="mb-8 text-xl font-semibold">{state?.title ?? "Untitled session"}</h1>

        <div className="relative mb-6 h-64 w-64">
          {running && (
            <div className="tf-breathe absolute inset-0 rounded-full bg-gold/10 blur-xl" />
          )}

          <svg viewBox="0 0 200 200" className="relative h-64 w-64">
            <circle cx="100" cy="100" r="92" fill="none" stroke="#FBF4E6" strokeOpacity="0.08" strokeWidth="2" />

            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * 360;
              const isTwelve = i === 0;
              return (
                <line
                  key={i}
                  x1="100"
                  y1={isTwelve ? "12" : "16"}
                  x2="100"
                  y2="24"
                  stroke={isTwelve ? "#E85D4C" : "#FBF4E6"}
                  strokeOpacity={isTwelve ? 0.9 : 0.25}
                  strokeWidth={isTwelve ? 3 : 2}
                  strokeLinecap="round"
                  transform={`rotate(${angle} 100 100)`}
                />
              );
            })}

            <line
              x1="100"
              y1="100"
              x2="100"
              y2="34"
              stroke="#E85D4C"
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                transformOrigin: "100px 100px",
                transform: `rotate(${handRotation}deg)`,
                transition: running ? "transform 1s linear" : "none",
              }}
            />
            <circle cx="100" cy="100" r="5" fill="#F0B429" />
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl tabular-nums">{formatTime(seconds)}</span>
            <span className="mt-1 text-xs text-gold">
              +{estimatedCoins}c so far
            </span>
          </div>

          {mintPulse && (
            <span className="tf-mint pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 text-sm font-semibold text-gold">
              +coin
            </span>
          )}
        </div>

        {running && (
          <div className="mb-8 flex h-3 items-end gap-1">
            {Array.from({ length: coinsPile }).map((_, i) => (
              <span key={i} className="h-2 w-2 rounded-full bg-gold" style={{ opacity: 0.4 + i * 0.07 }} />
            ))}
          </div>
        )}

        {result ? (
          <div className="w-full rounded-2xl border border-gold/30 bg-gold/10 p-6">
            <p className="mb-1 text-2xl font-semibold text-gold">+{result.coinsEarned} coins</p>
            <p className="mb-6 text-sm text-cream/60">{result.focusedMins} minutes focused</p>
            <button
              onClick={() => navigate("/today")}
              className="w-full rounded-lg bg-gold py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              Back to Today
            </button>
          </div>
        ) : !running ? (
          <button
            onClick={start}
            className="w-full rounded-lg bg-gold py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            Start focus session
          </button>
        ) : (
          <button
            onClick={finish}
            className="w-full rounded-lg border border-coral py-3 text-sm font-medium text-coral transition-colors hover:bg-coral/10"
          >
            End session
          </button>
        )}
      </main>
    </div>
  );
}
