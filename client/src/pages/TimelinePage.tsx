import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Timeline } from '../components/timeline/Timeline';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TaskForm } from '../components/task/TaskForm';
import { EmptyState } from '../components/ui/EmptyState';
import { getTodayDateString } from '../utils/time';
import type { Task } from '../types';

export function TimelinePage() {
  const { state, addTask, addToast, startFocus, completeTask, deleteTask, rescheduleTask } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [defaultHour, setDefaultHour] = useState(9);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const today = getTodayDateString();
  const todayTasks = state.tasks.filter((t) => t.date === today);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <SectionHeading
          label="FULL VIEW"
          title="24-HOUR TIMELINE"
          subtitle="Your day as a futuristic financial ledger. Every hour has potential."
        />
        <Button size="sm" onClick={() => setShowModal(true)} className="shrink-0 mt-2">
          <Plus className="w-4 h-4 inline mr-1" /> ADD TASK
        </Button>
      </div>

      {todayTasks.length === 0 && (
        <EmptyState
          title="NOTHING PLANNED YET."
          description="Tap any hour below to plan your day. Every slot is an opportunity."
          actionLabel="PLAN AN HOUR"
          onAction={() => setShowModal(true)}
        />
      )}

      <Timeline
        tasks={state.tasks}
        onHourClick={(hour, task) => {
          if (task) setSelectedTask(task);
          else {
            setDefaultHour(hour);
            setShowModal(true);
          }
        }}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="CREATE TASK">
        <TaskForm
          defaultHour={defaultHour}
          onSubmit={(data) => {
            const err = addTask(data);
            if (err) return err;
            setShowModal(false);
            addToast('Task added', 'success');
            return null;
          }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title={selectedTask?.name}>
        {selectedTask && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {!selectedTask.completed && (
                <>
                  <Button onClick={() => { startFocus(selectedTask.id); setSelectedTask(null); }}>START FOCUS</Button>
                  <Button variant="secondary" onClick={() => { completeTask(selectedTask.id); setSelectedTask(null); addToast('Task completed', 'success'); }}>COMPLETE</Button>
                  <Button variant="secondary" onClick={() => { rescheduleTask(selectedTask.id, new Date().getHours() + 1); setSelectedTask(null); }}>RESCHEDULE</Button>
                </>
              )}
              <Button variant="danger" onClick={() => { deleteTask(selectedTask.id); setSelectedTask(null); }}>DELETE</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
