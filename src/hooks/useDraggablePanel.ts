import { useRef, useEffect, useCallback, useState, type RefObject } from 'react';
import { useDragControls, useMotionValue } from 'framer-motion';

function clampToViewport(x: number, y: number, width: number, height: number) {
  const pad = 8;
  return {
    x: Math.min(Math.max(pad, x), Math.max(pad, window.innerWidth - width - pad)),
    y: Math.min(Math.max(pad, y), Math.max(pad, window.innerHeight - height - pad)),
  };
}

interface UseDraggablePanelOptions {
  storageKey: string;
  enabled: boolean;
  defaultPosition?: (width: number, height: number) => { x: number; y: number };
}

export function useDraggablePanel({
  storageKey,
  enabled,
  defaultPosition,
}: UseDraggablePanelOptions) {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [ready, setReady] = useState(false);

  const getDefault = defaultPosition ?? ((width: number, height: number) => ({
    x: Math.max(12, window.innerWidth - width - 16),
    y: Math.max(12, window.innerHeight - height - 100),
  }));

  const applyPosition = useCallback(
    (nextX: number, nextY: number, persist = true) => {
      const el = panelRef.current;
      const width = el?.offsetWidth ?? 200;
      const height = el?.offsetHeight ?? 48;
      const clamped = clampToViewport(nextX, nextY, width, height);
      x.set(clamped.x);
      y.set(clamped.y);
      if (persist) {
        localStorage.setItem(storageKey, JSON.stringify(clamped));
      }
      return clamped;
    },
    [storageKey, x, y]
  );

  useEffect(() => {
    if (!enabled) {
      setReady(false);
      return;
    }

    const init = () => {
      const el = panelRef.current;
      if (!el) return;
      let start = getDefault(el.offsetWidth, el.offsetHeight);
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const saved = JSON.parse(raw) as { x: number; y: number };
          if (typeof saved.x === 'number' && typeof saved.y === 'number') start = saved;
        }
      } catch {
        /* ignore */
      }
      applyPosition(start.x, start.y, false);
      setReady(true);
    };

    init();
    const onResize = () => applyPosition(x.get(), y.get());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [enabled, storageKey, applyPosition, getDefault, x, y]);

  const handleDragEnd = () => applyPosition(x.get(), y.get());

  return {
    panelRef: panelRef as RefObject<HTMLDivElement>,
    dragControls,
    x,
    y,
    ready,
    handleDragEnd,
    applyPosition,
  };
}
