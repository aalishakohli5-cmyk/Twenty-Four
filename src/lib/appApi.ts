import type { Task, TaskCategory, Transaction } from '../types';
import { api } from './api';
import { isApiConfigured } from './supabaseConfig';
import { categoryToActivityType, getDifficulty } from '../utils/time';

interface ApiTask {
  id: string;
  title: string;
  category: string | null;
  date: string;
  startHour: number;
  durationHrs: number;
  difficulty: 'SHORT' | 'MEDIUM' | 'DIFFICULT';
  status: string;
  createdAt: string;
}

interface ApiTransaction {
  id: string;
  type: string;
  amount: number;
  note: string | null;
  createdAt: string;
}

const CATEGORY_MAP: Record<string, TaskCategory> = {
  work: 'Work',
  personal: 'Personal',
  class: 'Study',
  focus: 'Study',
  sleep: 'Personal',
  meals: 'Personal',
  travel: 'Other',
};

function mapApiCategory(category: string | null): TaskCategory {
  if (!category) return 'Other';
  return CATEGORY_MAP[category.toLowerCase()] ?? 'Other';
}

function mapFeatureCategory(category: TaskCategory): string {
  const reverse: Record<TaskCategory, string> = {
    Study: 'class',
    Work: 'work',
    Personal: 'personal',
    Exercise: 'personal',
    Creative: 'personal',
    Other: 'personal',
  };
  return reverse[category] ?? 'personal';
}

function mapDifficulty(duration: number, category: TaskCategory): 'SHORT' | 'MEDIUM' | 'DIFFICULT' {
  const d = getDifficulty(duration, category);
  if (d === 'short') return 'SHORT';
  if (d === 'medium') return 'MEDIUM';
  return 'DIFFICULT'; // maps from local 'hard'
}

export function apiTaskToTask(task: ApiTask): Task {
  const category = mapApiCategory(task.category);
  const date = new Date(task.date).toISOString().slice(0, 10);
  return {
    id: task.id,
    name: task.title,
    category,
    startHour: task.startHour,
    duration: task.durationHrs,
    activityType: categoryToActivityType(category, task.title),
    completed: task.status === 'COMPLETED',
    createdAt: task.createdAt,
    date,
  };
}

function apiTransactionToTransaction(tx: ApiTransaction): Transaction {
  const type =
    tx.amount < 0 ? 'spend' : tx.type.includes('BONUS') ? 'bonus' : tx.type.includes('DECAY') ? 'decay' : 'earn';
  return {
    id: tx.id,
    amount: tx.amount,
    description: tx.note || tx.type.replace(/_/g, ' ').toLowerCase(),
    type,
    timestamp: tx.createdAt,
  };
}

export async function fetchRemoteData(date: string) {
  if (!isApiConfigured()) {
    return null;
  }

  const [{ tasks }, wallet] = await Promise.all([
    api.get(`/api/tasks?date=${date}`) as Promise<{ tasks: ApiTask[] }>,
    api.get('/api/wallet') as Promise<{
      balance: number;
      streakDays: number;
      transactions: ApiTransaction[];
    }>,
  ]);

  return {
    tasks: tasks.map(apiTaskToTask),
    walletBalance: wallet.balance,
    streakDays: wallet.streakDays,
    transactions: wallet.transactions.map(apiTransactionToTransaction),
  };
}

export async function createRemoteTask(data: {
  name: string;
  category: TaskCategory;
  startHour: number;
  duration: number;
  date: string;
}) {
  if (!isApiConfigured()) return null;

  const result = (await api.post('/api/tasks', {
    title: data.name,
    category: mapFeatureCategory(data.category),
    date: data.date,
    startHour: data.startHour,
    durationHrs: data.duration,
    difficulty: mapDifficulty(data.duration, data.category),
  })) as { task: ApiTask };

  return apiTaskToTask(result.task);
}

export async function completeRemoteTask(taskId: string) {
  if (!isApiConfigured()) return null;
  return api.post(`/api/tasks/${taskId}/complete`);
}

export async function updateRemoteTask(
  taskId: string,
  data: {
    name: string;
    category: TaskCategory;
    startHour: number;
    duration: number;
  }
) {
  if (!isApiConfigured()) return null;

  const result = (await api.patch(`/api/tasks/${taskId}`, {
    title: data.name,
    category: mapFeatureCategory(data.category),
    startHour: data.startHour,
    durationHrs: data.duration,
    difficulty: mapDifficulty(data.duration, data.category),
  })) as { task: ApiTask };

  return apiTaskToTask(result.task);
}

export async function deleteRemoteTask(taskId: string) {
  if (!isApiConfigured()) return;
  await api.delete(`/api/tasks/${taskId}`);
}

export async function startRemoteFocus(taskId?: string) {
  if (!isApiConfigured()) return null;
  const result = (await api.post('/api/focus/start', { taskId })) as {
    session: { id: string };
  };
  return result.session.id;
}

export async function endRemoteFocus(sessionId: string) {
  if (!isApiConfigured()) return null;
  return api.post(`/api/focus/${sessionId}/end`) as Promise<{
    coinsEarned: number;
    focusedMins: number;
  }>;
}
