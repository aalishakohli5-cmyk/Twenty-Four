import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { calculateFocusEarned } from '../utils/time';

export function useFocusTimer() {
  const { state, getFocusElapsed, pauseFocus, resumeFocus, endFocus } = useApp();
  const [elapsed, setElapsed] = useState(0);
  const session = state.focusSession;

  useEffect(() => {
    if (!session || session.status === 'paused') {
      setElapsed(getFocusElapsed());
      return;
    }

    setElapsed(getFocusElapsed());
    const interval = setInterval(() => {
      setElapsed(getFocusElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [session, getFocusElapsed]);

  const earnedCoins = calculateFocusEarned(elapsed, state.settings.coinRate);
  const isActive = session?.status === 'active';
  const isPaused = session?.status === 'paused';

  const togglePause = useCallback(() => {
    if (isPaused) resumeFocus();
    else pauseFocus();
  }, [isPaused, pauseFocus, resumeFocus]);

  return {
    session,
    elapsed,
    earnedCoins,
    isActive,
    isPaused,
    togglePause,
    endFocus,
    formatElapsed: (s: number) => {
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    },
  };
}

export function useCurrentTime(intervalMs = 1000) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return now;
}

export function useReducedMotion() {
  const { state } = useApp();
  const [systemPrefers, setSystemPrefers] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemPrefers(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemPrefers(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return state.settings.reducedMotion || systemPrefers;
}
