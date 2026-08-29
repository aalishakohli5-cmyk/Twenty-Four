import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Pause,
  Play,
  Maximize2,
  Square,
  GripHorizontal,
  X,
  PanelBottomOpen,
  PictureInPicture2,
} from 'lucide-react';
import { useFocusTimer } from '../../hooks/useFocusTimer';
import { useDraggablePanel } from '../../hooks/useDraggablePanel';
import { useFocusPictureInPicture } from '../../hooks/useFocusPictureInPicture';
import { CoinBadge } from '../ui/CoinBadge';
import { useApp } from '../../context/AppContext';

const POS_STORAGE_KEY = 'twentyfour-focus-taskbar-pos';
const RESTORE_POS_KEY = 'twentyfour-focus-restore-pos';
const DISMISS_STORAGE_KEY = 'twentyfour-focus-taskbar-dismissed';

function loadDismissed(): boolean {
  return localStorage.getItem(DISMISS_STORAGE_KEY) === 'true';
}

function getDefaultBarPosition(width: number, height: number) {
  const pad = 12;
  const bottomOffset = window.innerWidth >= 1024 ? 24 : 92;
  return {
    x: Math.max(pad, (window.innerWidth - width) / 2),
    y: Math.max(pad, window.innerHeight - height - bottomOffset),
  };
}

export function FocusTaskbar() {
  const { addToast } = useApp();
  const { session, elapsed, earnedCoins, isPaused, togglePause, endFocus, formatElapsed } = useFocusTimer();
  const location = useLocation();
  const onFocusPage = location.pathname === '/app/focus';

  const dragControls = useDragControls();
  const [dismissed, setDismissed] = useState(loadDismissed);

  const showBar = !!session && !onFocusPage && !dismissed;
  const showRestore = !!session && !onFocusPage && dismissed;

  const barDrag = useDraggablePanel({
    storageKey: POS_STORAGE_KEY,
    enabled: showBar,
    defaultPosition: getDefaultBarPosition,
  });

  const restoreDrag = useDraggablePanel({
    storageKey: RESTORE_POS_KEY,
    enabled: showRestore,
    defaultPosition: (width, height) => ({
      x: Math.max(12, window.innerWidth - width - 16),
      y: Math.max(12, window.innerHeight - height - 100),
    }),
  });

  const pipData = {
    taskName: session?.taskName ?? '',
    elapsed: session ? formatElapsed(elapsed) : '00:00',
    earned: earnedCoins,
    isPaused,
  };

  const { supported: pipSupported, isPiPActive, openPiP, updatePiP, closePiP } =
    useFocusPictureInPicture({
      onTogglePause: togglePause,
      onEnd: () => endFocus(false),
      onRestoreBar: () => {
        setDismissed(false);
        localStorage.removeItem(DISMISS_STORAGE_KEY);
      },
    });

  useEffect(() => {
    if (!session) {
      setDismissed(false);
      localStorage.removeItem(DISMISS_STORAGE_KEY);
      closePiP();
    }
  }, [session, closePiP]);

  useEffect(() => {
    if (isPiPActive && session) {
      updatePiP({
        taskName: session.taskName,
        elapsed: formatElapsed(elapsed),
        earned: earnedCoins,
        isPaused,
      });
    }
  }, [elapsed, earnedCoins, isPaused, session, isPiPActive, updatePiP, formatElapsed]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISS_STORAGE_KEY, 'true');
  };

  const handleRestore = () => {
    setDismissed(false);
    localStorage.removeItem(DISMISS_STORAGE_KEY);
  };

  const handlePin = useCallback(async () => {
    if (!session) return;
    if (isPiPActive) {
      closePiP();
      addToast('Unpinned from desktop', 'info');
      return;
    }
    const ok = await openPiP(pipData);
    if (ok) addToast('Pinned outside browser — stays visible when you switch tabs', 'success');
    else addToast('Picture-in-Picture not supported in this browser (try Chrome/Edge)', 'error');
  }, [session, isPiPActive, closePiP, openPiP, pipData, addToast]);

  const handleEnd = () => {
    closePiP();
    endFocus(false);
  };

  return (
    <>
      <AnimatePresence>
        {showBar && session && (
          <motion.div
            ref={barDrag.panelRef}
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0}
            onDragEnd={barDrag.handleDragEnd}
            style={{ x: barDrag.x, y: barDrag.y, position: 'fixed', top: 0, left: 0, zIndex: 70 }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: barDrag.ready ? 1 : 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            whileDrag={{ scale: 1.02, boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}
            className="w-[calc(100%-1.5rem)] max-w-xl pointer-events-auto"
          >
            <div className="glass-card rounded-2xl p-3 md:p-4 border border-accent-lime/25 shadow-2xl">
              <div
                className="flex items-center gap-2 mb-2 cursor-grab active:cursor-grabbing select-none touch-none"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <GripHorizontal className="w-4 h-4 text-text-secondary shrink-0 opacity-60" aria-hidden />
                <span className="w-2 h-2 rounded-full bg-accent-lime animate-pulse shrink-0" />
                <span className="font-condensed text-xs tracking-widest text-accent-lime truncate">
                  {isPaused ? 'PAUSED' : 'FOCUSING · BROWSE ANYWHERE'}
                </span>
                <span className="ml-auto font-condensed text-[9px] tracking-wider text-text-secondary opacity-60 hidden sm:inline">
                  DRAG
                </span>
                {pipSupported && (
                  <button
                    type="button"
                    onClick={handlePin}
                    className={`p-1 rounded-lg transition-colors shrink-0 ${
                      isPiPActive ? 'text-accent-lime bg-accent-lime/15' : 'text-text-secondary hover:text-text-primary hover:bg-theme-muted'
                    }`}
                    aria-label={isPiPActive ? 'Unpin from desktop' : 'Pin outside browser'}
                    title="Pin outside browser (Picture-in-Picture)"
                  >
                    <PictureInPicture2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-theme-muted transition-colors shrink-0"
                  aria-label="Hide focus bar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div
                  className="min-w-0 flex-1 cursor-grab active:cursor-grabbing select-none touch-none"
                  onPointerDown={(e) => dragControls.start(e)}
                >
                  <p className="font-medium truncate text-sm md:text-base">{session.taskName}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-mono text-xl md:text-2xl font-bold">{formatElapsed(elapsed)}</span>
                    <CoinBadge amount={earnedCoins} size="sm" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={togglePause}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={isPaused ? 'Resume' : 'Pause'}
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleEnd}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-accent-orange/20 hover:text-accent-orange transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="End focus session"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                  <Link
                    to="/app/focus?view=immersive"
                    className="p-2.5 rounded-xl bg-accent-lime text-black hover:brightness-110 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Open immersive focus view"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRestore && session && (
          <motion.div
            ref={restoreDrag.panelRef}
            drag
            dragControls={restoreDrag.dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0}
            onDragEnd={restoreDrag.handleDragEnd}
            style={{ x: restoreDrag.x, y: restoreDrag.y, position: 'fixed', top: 0, left: 0, zIndex: 70 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: restoreDrag.ready ? 1 : 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileDrag={{ scale: 1.04 }}
            className="pointer-events-auto touch-none"
          >
            <div className="flex items-center gap-1 glass-card rounded-full pl-2 pr-1 py-1 border border-accent-lime/25 shadow-lg">
              <div
                className="p-1.5 cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={(e) => restoreDrag.dragControls.start(e)}
                aria-hidden
              >
                <GripHorizontal className="w-3.5 h-3.5 text-text-secondary opacity-60" />
              </div>
              <button
                type="button"
                onClick={handleRestore}
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white/5 transition-colors"
              >
                <PanelBottomOpen className="w-4 h-4 text-accent-lime" />
                <span className="font-mono text-sm font-bold tabular-nums">{formatElapsed(elapsed)}</span>
                <span className="font-condensed text-[10px] tracking-wider text-text-secondary hidden sm:inline">
                  SHOW BAR
                </span>
              </button>
              {pipSupported && (
                <button
                  type="button"
                  onClick={handlePin}
                  className={`p-2 rounded-full transition-colors ${
                    isPiPActive ? 'bg-accent-lime/20 text-accent-lime' : 'hover:bg-theme-muted text-text-secondary'
                  }`}
                  aria-label="Pin outside browser"
                >
                  <PictureInPicture2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
