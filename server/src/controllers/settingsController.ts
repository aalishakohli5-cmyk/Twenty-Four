import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";

function utcDay(date = new Date()) {
  const day = new Date(date);
  day.setUTCHours(0, 0, 0, 0);
  return day;
}

export async function getSettings(req: AuthedRequest, res: Response) {
  const today = utcDay();
  const [settings, restDays] = await Promise.all([
    prisma.userSettings.upsert({
      where: { profileId: req.userId! },
      update: {},
      create: { profileId: req.userId! },
    }),
    prisma.restDay.findMany({
      where: { profileId: req.userId!, date: { gte: today } },
      orderBy: { date: "asc" },
    }),
  ]);
  res.json({ settings, restDays });
}

export async function startPause(req: AuthedRequest, res: Response) {
  const days = Math.min(14, Math.max(1, Number(req.body.days) || 1));
  const reason = String(req.body.reason || "Personal leave").slice(0, 100);
  const today = utcDay();
  const dates = Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() + index);
    return date;
  });

  await prisma.$transaction(dates.map((date) => prisma.restDay.upsert({
    where: { profileId_date: { profileId: req.userId!, date } },
    update: { reason },
    create: { profileId: req.userId!, date, reason },
  })));
  res.status(201).json({ restDays: dates, reason });
}

export async function endPause(req: AuthedRequest, res: Response) {
  await prisma.restDay.deleteMany({
    where: { profileId: req.userId!, date: { gte: utcDay() } },
  });
  res.json({ ok: true });
}
