import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";

export async function listRewards(req: AuthedRequest, res: Response) {
  const rewards = await prisma.reward.findMany({ orderBy: { priceCoins: "asc" } });
  const owned = await prisma.userReward.findMany({
    where: { profileId: req.userId! },
  });
  const ownedIds = new Set(owned.map((o) => o.rewardId));
  const activeId = owned.find((o) => o.active)?.rewardId;

  res.json({
    rewards: rewards.map((r) => ({
      ...r,
      owned: ownedIds.has(r.id),
      active: r.id === activeId,
    })),
  });
}

// Unlocked rewards stay permanently available once bought (product doc
// section 6): this only ever inserts a UserReward row once.
export async function purchaseReward(req: AuthedRequest, res: Response) {
  const { rewardId } = req.body;

  const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
  if (!reward) return res.status(404).json({ error: "Reward not found" });

  const already = await prisma.userReward.findUnique({
    where: { profileId_rewardId: { profileId: req.userId!, rewardId } },
  });
  if (already) return res.status(400).json({ error: "Already owned" });

  const profile = await prisma.profile.findUnique({ where: { id: req.userId! } });
  if (!profile || profile.coinBalance < reward.priceCoins) {
    return res.status(400).json({ error: "Not enough coins" });
  }

  const [, userReward] = await prisma.$transaction([
    prisma.profile.update({
      where: { id: req.userId! },
      data: { coinBalance: { decrement: reward.priceCoins } },
    }),
    prisma.userReward.create({
      data: { profileId: req.userId!, rewardId },
    }),
    prisma.transaction.create({
      data: {
        profileId: req.userId!,
        type: "REWARD_PURCHASE",
        amount: -reward.priceCoins,
        note: `Unlocked "${reward.name}"`,
      },
    }),
  ]);

  res.status(201).json({ userReward });
}

export async function activateReward(req: AuthedRequest, res: Response) {
  const { rewardId } = req.body;

  const owned = await prisma.userReward.findUnique({
    where: { profileId_rewardId: { profileId: req.userId!, rewardId } },
    include: { reward: true },
  });
  if (!owned) return res.status(400).json({ error: "You don't own this reward yet" });

  await prisma.$transaction([
    prisma.userReward.updateMany({
      where: { profileId: req.userId!, reward: { category: owned.reward.category } },
      data: { active: false },
    }),
    prisma.userReward.update({
      where: { profileId_rewardId: { profileId: req.userId!, rewardId } },
      data: { active: true },
    }),
  ]);

  res.json({ ok: true });
}
