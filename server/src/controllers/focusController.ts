import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";
import { focusCoinsForMinutes } from "../utils/coins";

function startOfUtcDay(daysAgo = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

async function focusTotals(profileId: string, since: Date) {
  const totals = await prisma.focusSession.aggregate({
    where: { profileId, startedAt: { gte: since }, endedAt: { not: null } },
    _sum: { focusedMins: true, coinsEarned: true },
    _count: { id: true },
  });
  return {
    minutes: totals._sum.focusedMins ?? 0,
    coins: totals._sum.coinsEarned ?? 0,
    sessions: totals._count.id,
  };
}

export async function getFocusSummary(req: AuthedRequest, res: Response) {
  const now = new Date();
  const weekStart = startOfUtcDay();
  weekStart.setUTCDate(weekStart.getUTCDate() - ((weekStart.getUTCDay() + 6) % 7));
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const [today, week, month] = await Promise.all([
    focusTotals(req.userId!, startOfUtcDay()),
    focusTotals(req.userId!, weekStart),
    focusTotals(req.userId!, monthStart),
  ]);
  res.json({ today, week, month });
}

export async function startFocusSession(req: AuthedRequest, res: Response) {
  const { taskId } = req.body;

  const session = await prisma.focusSession.create({
    data: { profileId: req.userId!, taskId: taskId ?? null },
  });

  if (taskId) {
    await prisma.task.update({
      where: { id: taskId },
      data: { status: "IN_PROGRESS" },
    });
  }

  res.status(201).json({ session });
}

export async function endFocusSession(req: AuthedRequest, res: Response) {
  const { id } = req.params;

  const session = await prisma.focusSession.findFirst({
    where: { id, profileId: req.userId! },
  });
  if (!session) return res.status(404).json({ error: "Session not found" });
  if (session.endedAt) return res.status(400).json({ error: "Session already ended" });

  const settings = await prisma.userSettings.findUnique({
    where: { profileId: req.userId! },
  });
  const rate = settings?.focusCoinsPerHour ?? 10;

  const endedAt = new Date();
  const focusedMins = Math.max(
    0,
    Math.round((endedAt.getTime() - session.startedAt.getTime()) / 60000)
  );
  const coinsEarned = focusCoinsForMinutes(focusedMins, rate);

  const [updatedSession] = await prisma.$transaction([
    prisma.focusSession.update({
      where: { id },
      data: { endedAt, focusedMins, coinsEarned },
    }),
    prisma.profile.update({
      where: { id: req.userId! },
      data: { coinBalance: { increment: coinsEarned } },
    }),
    prisma.transaction.create({
      data: {
        profileId: req.userId!,
        type: "FOCUS_REWARD",
        amount: coinsEarned,
        note: `${focusedMins} min focus session`,
      },
    }),
  ]);

  res.json({ session: updatedSession, coinsEarned, focusedMins });
}
