import { TaskDifficulty } from "@prisma/client";

// Fixed completion bonuses per the product doc (section 6).
export const COMPLETION_BONUS: Record<TaskDifficulty, number> = {
  SHORT: 5,
  MEDIUM: 10,
  DIFFICULT: 20,
};

export function focusCoinsForMinutes(minutes: number, perHourRate: number): number {
  return Math.floor((minutes / 60) * perHourRate);
}
