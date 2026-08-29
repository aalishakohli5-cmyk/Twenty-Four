import { TaskDifficulty } from "@prisma/client";

export const COMPLETION_BONUS: Record<TaskDifficulty, number> = {
  SHORT: 5,
  MEDIUM: 15,
  DIFFICULT: 30,
};

export const SIGNUP_BONUS = 150;

export function focusCoinsForMinutes(minutes: number, perHourRate: number): number {
  return Math.floor((minutes / 60) * perHourRate);
}
