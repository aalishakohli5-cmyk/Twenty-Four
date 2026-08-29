import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCurrentTime } from '../hooks/useFocusTimer';
import {
  getGreeting,
  formatDateDisplay,
  formatTime,
  getHoursLeft,
} from '../utils/time';
import { CoinCounter } from '../components/ui/CoinCounter';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { Timeline } from '../components/timeline/Timeline';
import { Modal } from '../components/ui/Modal';
import { TaskForm } from '../components/task/TaskForm';
import { EmptyState } from '../components/ui/EmptyState';
import { CoinRewardAnimation } from '../components/common/CoinRewardAnimation';
import type { Task } from '../types';

export function TodayPage() {
  const {
    state,
    todayTasks,
    potentialCoinsRemaining,
    addTask,
    completeTask,
    startFocus,
    rescheduleTask,
    deleteTask,
    addToast,
  } = useApp();

  const now = useCurrentTime();
  const dateInfo = formatDateDisplay(now);
  const hoursLeft = getHoursLeft();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [rewardAnim, setRewardAnim] = useState({ show: false, amount: 0 });

  const restDay = state.restDays.find((r) => r.date === now.toISOString().split('T')[0]);
  const completedCount = todayTasks.filter((t) => t.completed).length;

  const handleHourClick = (hour: number, task?: Task) => {
    if (task) {
      setSelectedTask(task);
    } else {
      setSelectedHour(hour);
      setSelectedTask(null);
      setShowTaskModal(true);
    }
  };

  const handleComplete = (task: Task) => {
    const bonus = completeTask(task.id);
    if (bonus > 0) {
      setRewardAnim({ show: true, amount: bonus });
      addToast('Task completed', 'coins', bonus);
    }
  };

  const handleReschedule = (task: Task) => {
    const nextHour = Math.min(23, new Date().getHours() + 1);
    const err = rescheduleTask(task.id, nextHour);
    if (err) addToast(err, 'error');
    else addToast('Task rescheduled', 'success');
    setSelectedTask(null);
  };

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <p className="font-condensed text-xs tracking-[0.2em] text-text-secondary">
            {getGreeting()}, {state.profile.name}
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight mt-2">
            YOUR NEXT 24 HOURS.
          </h1>
        </div>

        <div className="flex flex-wrap items-end gap-6 md:gap-12">
          <div>
            <span className="font-display text-4xl font-bold text-text-secondary">{dateInfo.day}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-5xl md:text-6xl font-bold">{dateInfo.date}</span>
              <span className="font-condensed text-lg tracking-widest text-text-secondary">{dateInfo.month}</span>
              <span className="font-mono text-sm text-text-secondary">{dateInfo.year}</span>
            </div>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="font-condensed text-xs tracking-widest text-text-secondary">CURRENT TIME</p>
              <p className="font-mono text-2xl font-bold mt-1">{formatTime(now)}</p>
            </div>
            <div>
              <p className="font-condensed text-xs tracking-widest text-text-secondary">BALANCE</p>
              <CoinCounter value={state.walletBalance} size="md" className="text-accent-orange mt-1" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero metrics */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <GlassCard className="relative overflow-hidden">
          <div className="absolute top-4 right-4 font-condensed text-[10px] tracking-widest text-text-secondary">
            TIME IS MOVING →
          </div>
          <p className="font-condensed text-xs tracking-widest text-text-secondary mb-4">
            YOU HAVE
          </p>
          <div className="flex items-end gap-3">
            <span className="font-display text-[clamp(4rem,12vw,8rem)] font-bold leading-none text-accent-lime text-hero-stat">
              {hoursLeft}
            </span>
            <div className="pb-4">
              <span className="font-display text-2xl md:text-3xl font-bold block">HOURS</span>
              <span className="font-condensed text-sm tracking-widest text-text-secondary">LEFT</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="font-condensed text-xs tracking-widest text-text-secondary mb-4">
            POTENTIAL REMAINING
          </p>
          <div className="flex items-end gap-2">
            <span className="font-mono text-4xl md:text-5xl font-bold text-accent-orange">
              +{potentialCoinsRemaining}
            </span>
            <span className="font-condensed text-sm tracking-widest text-text-secondary pb-2">
              COINS POSSIBLE
            </span>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-text-secondary">
            <span>{completedCount}/{todayTasks.length} tasks done</span>
            {state.streak > 0 && (
              <span className="flex items-center gap-1 text-accent-pink">
                <Flame className="w-4 h-4" /> {state.streak} day streak
              </span>
            )}
          </div>
        </GlassCard>
      </div>

      {restDay && (
        <GlassCard className="border-accent-lime/20 bg-accent-lime/5">
          <p className="font-condensed text-xs tracking-widest text-accent-lime">PROTECTED DAY</p>
          <p className="font-display text-xl font-bold mt-1">{restDay.label}</p>
          <p className="text-text-secondary text-sm mt-2">No penalties today. Rest with intention.</p>
        </GlassCard>
      )}

      {/* Timeline section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="font-condensed text-xs tracking-[0.2em] text-accent-lime">TIMELINE</span>
            <h2 className="font-display text-2xl md:text-3xl font-bold mt-1">TODAY&apos;S 24</h2>
          </div>
          <Button size="sm" onClick={() => { setSelectedHour(new Date().getHours()); setShowTaskModal(true); }}>
            <Plus className="w-4 h-4 inline mr-1" /> PLAN HOUR
          </Button>
        </div>

        {todayTasks.length === 0 && (
          <EmptyState
            title="NOTHING PLANNED YET."
            description="Your next hour is waiting. Tap any open slot below to plan."
            actionLabel="PLAN AN HOUR"
            onAction={() => setShowTaskModal(true)}
          />
        )}

        <div className={todayTasks.length === 0 ? 'mt-6' : ''}>
          <Timeline
            tasks={state.tasks}
            onHourClick={handleHourClick}
            compact
          />
        </div>
      </div>

      {/* Task detail modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.name}
      >
        {selectedTask && (
          <div className="space-y-4">
            <p className="text-text-secondary text-sm">
              {selectedTask.category} · {selectedTask.duration}h
            </p>
            <div className="flex flex-wrap gap-3">
              {!selectedTask.completed && (
                <>
                  <Button onClick={() => { startFocus(selectedTask.id); setSelectedTask(null); }}>
                    START FOCUS
                  </Button>
                  <Button variant="secondary" onClick={() => handleComplete(selectedTask)}>
                    MARK COMPLETE
                  </Button>
                  <Button variant="secondary" onClick={() => handleReschedule(selectedTask)}>
                    RESCHEDULE
                  </Button>
                </>
              )}
              <Button variant="danger" onClick={() => { deleteTask(selectedTask.id); setSelectedTask(null); }}>
                DELETE
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create task modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="CREATE TASK"
      >
        <TaskForm
          defaultHour={selectedHour}
          onSubmit={(data) => {
            const err = addTask(data);
            if (err) return err;
            setShowTaskModal(false);
            addToast('Task added to timeline', 'success');
            return null;
          }}
          onCancel={() => setShowTaskModal(false)}
        />
      </Modal>

      <CoinRewardAnimation
        amount={rewardAnim.amount}
        show={rewardAnim.show}
        onComplete={() => setRewardAnim({ show: false, amount: 0 })}
      />
    </div>
  );
}
