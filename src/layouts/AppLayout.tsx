import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '../components/navigation/Navigation';
import { MobileNavigation } from '../components/navigation/MobileNavigation';
import { FocusTaskbar } from '../components/focus/FocusTaskbar';
import { ToastContainer } from '../components/ui/Toast';
import { CompanionAvatar } from '../components/avatars/CompanionAvatar';
import { AnimatedBackground } from '../components/motion/AnimatedBackground';
import { useApp } from '../context/AppContext';
import { useMotionOptional } from '../context/MotionContext';
import { useReducedMotion } from '../hooks/useFocusTimer';

export function AppLayout() {
  const { toasts, dismissToast, state } = useApp();
  const location = useLocation();
  const reduced = useReducedMotion();
  const motionCtx = useMotionOptional();
  const focusing = !!state.focusSession;

  useEffect(() => {
    motionCtx?.setFocusMode(focusing);
  }, [focusing, motionCtx]);

  return (
    <div className="min-h-screen bg-bg-primary bg-grid bg-grain bg-paper relative overflow-x-hidden">
      <AnimatedBackground variant={state.equippedTheme === 'default' ? 'minimal' : 'default'} />
      <CompanionAvatar />

      <Navigation />
      <MobileNavigation />
      <FocusTaskbar />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`relative z-10 pt-20 xl:pt-28 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 w-full max-w-[1440px] xl:max-w-[1680px] 2xl:max-w-[1920px] mx-auto ${
            focusing ? 'pb-44 xl:pb-32' : 'pb-28 xl:pb-12'
          }`}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
