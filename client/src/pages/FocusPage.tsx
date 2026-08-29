import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useFocusTimer } from '../hooks/useFocusTimer';
import { useMotionOptional } from '../context/MotionContext';
import { Button } from '../components/ui/Button';
import { CoinBadge } from '../components/ui/CoinBadge';
import { FocusArcTimer } from '../components/focus/FocusArcTimer';
import { EmptyState } from '../components/ui/EmptyState';
import { CoinRewardAnimation } from '../components/common/CoinRewardAnimation';

export function FocusPage() {
  const { todayTasks, startFocus, addToast } = useApp();
  const { session, elapsed, earnedCoins, isPaused, togglePause, endFocus, formatElapsed } = useFocusTimer();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const motionCtx = useMotionOptional();
  const [rewardAnim, setRewardAnim] = useState({ show: false, amount: 0 });
  const immersive = searchParams.get('view') === 'immersive';

  useEffect(() => {
    motionCtx?.setFocusMode(!!session);
    return () => motionCtx?.setFocusMode(false);
  }, [session, motionCtx]);

  const focusTasks = todayTasks.filter(
    (t) => !t.completed && ['focus', 'task'].includes(t.activityType)
  );

  const handleStart = (taskId: string) => {
    startFocus(taskId);
    addToast('Focus started — browse anywhere while the timer runs', 'success');
    navigate('/app/today');
  };

  const handleEnd = (complete = false) => {
    const earned = endFocus(complete);
    if (earned > 0) {
      setRewardAnim({ show: true, amount: earned });
      addToast('Focus complete', 'coins', earned);
    }
    if (complete) navigate('/app/today');
    else navigate('/app/today');
  };

  if (!session) {
    return (
      <div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span className="font-condensed text-xs tracking-[0.2em] text-accent-lime">DEEP WORK</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-2">
            FOCUS MODE
          </h1>
          <p className="text-text-secondary mt-3 max-w-lg">
            Start a session, then move anywhere in the app. The focus bar stays with you while coins tick up.
          </p>
        </motion.div>

        {focusTasks.length === 0 ? (
          <EmptyState
            title="NO FOCUS TASKS"
            description="Add a study or work task to your timeline first."
            actionLabel="GO TO TODAY"
            onAction={() => navigate('/app/today')}
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {focusTasks.map((task) => (
              <motion.button
                key={task.id}
                whileHover={{ y: -2 }}
                onClick={() => handleStart(task.id)}
                className="glass-card rounded-2xl p-6 text-left hover:border-accent-lime/30 transition-colors"
              >
                <p className="font-condensed text-xs tracking-widest text-text-secondary">{task.category.toUpperCase()}</p>
                <p className="font-display text-xl font-bold mt-2">{task.name}</p>
                <p className="text-text-secondary text-sm mt-2">{task.duration}h planned</p>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!immersive) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <span className="font-condensed text-xs tracking-[0.2em] text-accent-lime">SESSION ACTIVE</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mt-2">
            {session.taskName}
          </h1>
          <p className="text-text-secondary mt-3 max-w-xl">
            You&apos;re in focus mode. Use the bottom bar on any page, or jump to Timeline, Store, Wallet, and Insights without stopping the timer.
          </p>
        </motion.div>

        <div className="glass-card rounded-2xl p-6 border border-accent-lime/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-condensed text-xs tracking-widest text-text-secondary">
                {isPaused ? 'PAUSED' : 'FOCUSING'}
              </p>
              <p className="font-mono text-4xl font-bold mt-2">{formatElapsed(elapsed)}</p>
              <div className="mt-3">
                <CoinBadge amount={earnedCoins} size="md" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={togglePause}>
                {isPaused ? 'RESUME' : 'PAUSE'}
              </Button>
              <Button variant="secondary" onClick={() => handleEnd(false)}>END</Button>
              <Link to="/app/focus?view=immersive">
                <Button>IMMERSIVE VIEW</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { to: '/app/today', label: 'Today' },
            { to: '/app/timeline', label: 'Timeline' },
            { to: '/app/wallet', label: 'Wallet' },
            { to: '/app/store', label: 'Store' },
            { to: '/app/insights', label: 'Insights' },
            { to: '/app/settings', label: 'Settings' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="glass-card rounded-xl px-4 py-3 flex items-center justify-between hover:border-accent-lime/30 transition-colors"
            >
              <span className="font-medium">{link.label}</span>
              <ArrowRight className="w-4 h-4 text-text-secondary" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const progress = Math.min(100, (elapsed / 3600) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-4"
    >
      <div className="relative z-10 w-full max-w-lg">
        <p className="font-condensed text-xs tracking-[0.3em] text-accent-lime mb-6">
          {isPaused ? 'PAUSED' : 'FOCUSING'}
        </p>

        <FocusArcTimer
          progress={progress}
          label={formatElapsed(elapsed)}
          sublabel={isPaused ? 'Paused' : 'Flow time'}
        />

        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight uppercase mt-6">
          {session.taskName}
        </h2>

        <div className="mt-8">
          <p className="font-condensed text-xs tracking-widest text-text-secondary">FOCUS REWARD</p>
          <div className="mt-2 flex justify-center">
            <CoinBadge amount={earnedCoins} size="lg" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <Button variant="secondary" onClick={togglePause}>
            {isPaused ? 'RESUME' : 'PAUSE'}
          </Button>
          <Button variant="secondary" onClick={() => handleEnd(false)}>END SESSION</Button>
          <Button onClick={() => handleEnd(true)}>COMPLETE TASK</Button>
          <Link to="/app/today">
            <Button variant="ghost">BROWSE APP</Button>
          </Link>
        </div>
      </div>

      <CoinRewardAnimation
        amount={rewardAnim.amount}
        show={rewardAnim.show}
        message="FOCUS COMPLETE"
        onComplete={() => setRewardAnim({ show: false, amount: 0 })}
      />
    </motion.div>
  );
}
