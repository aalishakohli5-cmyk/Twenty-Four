import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";

function startOfDay(dateStr: string) {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getDailyReport(req: AuthedRequest, res: Response) {
  const date = (req.query.date as string) ?? new Date().toISOString();
  const day = startOfDay(date);
  const nextDay = new Date(day);
  nextDay.setDate(nextDay.getDate() + 1);

  const tasks = await prisma.task.findMany({
    where: { profileId: req.userId!, date: day },
  });

  const focusSessions = await prisma.focusSession.findMany({
    where: {
      profileId: req.userId!,
      startedAt: { gte: day, lt: nextDay },
    },
  });

  const plannedHours = tasks.reduce((sum, t) => sum + t.durationHrs, 0);
  const completedHours = tasks
    .filter((t) => t.status === "COMPLETED")
    .reduce((sum, t) => sum + t.durationHrs, 0);
  const focusedMinutes = focusSessions.reduce((sum, s) => sum + s.focusedMins, 0);
  const coinsEarned = focusSessions.reduce((sum, s) => sum + s.coinsEarned, 0);

  const byHour: Record<number, number> = {};
  focusSessions.forEach((s) => {
    const hour = s.startedAt.getHours();
    byHour[hour] = (byHour[hour] ?? 0) + s.focusedMins;
  });
  const mostProductiveHour = Object.entries(byHour).sort((a, b) => b[1] - a[1])[0]?.[0];

  res.json({
    date: day,
    plannedHours,
    completedHours,
    focusedMinutes,
    coinsEarned,
    tasksCompleted: tasks.filter((t) => t.status === "COMPLETED").length,
    tasksTotal: tasks.length,
    mostProductiveHour: mostProductiveHour !== undefined ? Number(mostProductiveHour) : null,
  });
}
