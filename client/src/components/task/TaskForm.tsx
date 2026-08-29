import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Task, TaskCategory } from '../../types';
import { Button } from '../ui/Button';
import {
  formatHour,
  hourRangeLabel,
  getPotentialCoinsForTask,
  categoryToActivityType,
} from '../../utils/time';
import { CoinBadge } from '../ui/CoinBadge';

const CATEGORIES: TaskCategory[] = ['Study', 'Work', 'Personal', 'Exercise', 'Creative', 'Other'];

interface TaskFormProps {
  initial?: Task;
  defaultHour?: number;
  onSubmit: (data: {
    name: string;
    category: TaskCategory;
    startHour: number;
    duration: number;
  }) => string | null;
  onCancel: () => void;
}

export function TaskForm({ initial, defaultHour = 9, onSubmit, onCancel }: TaskFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [category, setCategory] = useState<TaskCategory>(initial?.category || 'Study');
  const [startHour, setStartHour] = useState(initial?.startHour ?? defaultHour);
  const [duration, setDuration] = useState(initial?.duration ?? 1);
  const [error, setError] = useState<string | null>(null);

  const previewTask = {
    name,
    category,
    startHour,
    duration,
    activityType: categoryToActivityType(category, name),
    date: initial?.date || '',
    id: '',
    completed: false,
    createdAt: '',
  };

  const potentialCoins = name.trim() ? getPotentialCoinsForTask(previewTask as Task) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = onSubmit({ name, category, startHour, duration });
    if (err) setError(err);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="task-name" className="font-condensed text-xs tracking-widest text-text-secondary block mb-2">
          TASK NAME
        </label>
        <input
          id="task-name"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(null); }}
          placeholder="Study React"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:border-accent-lime/50 focus:outline-none transition-colors"
          autoFocus
        />
      </div>

      <div>
        <span className="font-condensed text-xs tracking-widest text-text-secondary block mb-2">
          CATEGORY
        </span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-lg font-condensed text-xs tracking-wider transition-colors ${
                category === cat
                  ? 'bg-accent-lime text-black'
                  : 'bg-white/5 text-text-secondary hover:bg-white/10'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-hour" className="font-condensed text-xs tracking-widest text-text-secondary block mb-2">
            START TIME
          </label>
          <select
            id="start-hour"
            value={startHour}
            onChange={(e) => setStartHour(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-lime/50 focus:outline-none"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i} className="bg-bg-secondary">
                {formatHour(i)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="duration" className="font-condensed text-xs tracking-widest text-text-secondary block mb-2">
            DURATION (HRS)
          </label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-accent-lime/50 focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((d) => (
              <option key={d} value={d} className="bg-bg-secondary">
                {d} hour{d > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {name.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-4 flex items-center justify-between"
        >
          <div>
            <p className="font-condensed text-xs text-text-secondary tracking-wider">POTENTIAL REWARD</p>
            <p className="text-sm mt-1">{hourRangeLabel(startHour, duration)}</p>
          </div>
          <CoinBadge amount={potentialCoins} size="lg" />
        </motion.div>
      )}

      {error && (
        <p className="text-accent-orange text-sm" role="alert">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">ADD TO TIMELINE</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>CANCEL</Button>
      </div>
    </form>
  );
}
