import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";

async function applyYesterdayDecay(profileId: string) {
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  yesterday.setUTCHours(0, 0, 0, 0);
  const dayKey = yesterday.toISOString().slice(0, 10);
  const note = `No-plan deduction for ${dayKey}`;

  const [taskCount, protectedDay, alreadyApplied, settings, profile] = await Promise.all([
    prisma.task.count({ where: { profileId, date: yesterday } }),
    prisma.restDay.findUnique({ where: { profileId_date: { profileId, date: yesterday } } }),
    prisma.transaction.findFirst({ where: { profileId, type: "DECAY_PENALTY", note } }),
    prisma.userSettings.upsert({ where: { profileId }, update: {}, create: { profileId } }),
    prisma.profile.findUnique({ where: { id: profileId }, select: { coinBalance: true } }),
  ]);

  if (taskCount > 0 || protectedDay || alreadyApplied || !settings.decayEnabled || !profile?.coinBalance) return;
  const amount = Math.ceil(profile.coinBalance * (settings.decayPercent / 100));
  if (amount <= 0) return;
  await prisma.$transaction([
    prisma.profile.update({ where: { id: profileId }, data: { coinBalance: { decrement: amount } } }),
    prisma.transaction.create({ data: { profileId, type: "DECAY_PENALTY", amount: -amount, note } }),
  ]);
}

export async function getWallet(req: AuthedRequest, res: Response) {
  await applyYesterdayDecay(req.userId!);
  const profile = await prisma.profile.findUnique({
    where: { id: req.userId! },
    select: { coinBalance: true, streakDays: true },
  });

  const transactions = await prisma.transaction.findMany({
    where: { profileId: req.userId! },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  res.json({ balance: profile?.coinBalance ?? 0, streakDays: profile?.streakDays ?? 0, transactions });
}
