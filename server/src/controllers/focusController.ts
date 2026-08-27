import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";
import { focusCoinsForMinutes } from "../utils/coins";

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

// Ends the session, computes verified focus minutes server-side (never
// trusts a client-supplied duration), and awards focus coins.
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
