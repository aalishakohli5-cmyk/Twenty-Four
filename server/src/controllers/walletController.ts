import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";

export async function getWallet(req: AuthedRequest, res: Response) {
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
