import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";
import { COMPLETION_BONUS } from "../utils/coins";

function startOfDay(dateStr: string) {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function listTasksForDay(req: AuthedRequest, res: Response) {
  const date = (req.query.date as string) ?? new Date().toISOString();
  const day = startOfDay(date);

  const tasks = await prisma.task.findMany({
    where: { profileId: req.userId!, date: day },
    orderBy: { startHour: "asc" },
  });

  res.json({ tasks });
}

export async function createTask(req: AuthedRequest, res: Response) {
  const { title, category, date, startHour, durationHrs, difficulty } = req.body;

  if (!title || !date || startHour === undefined) {
    return res.status(400).json({ error: "title, date and startHour are required" });
  }

  const task = await prisma.task.create({
    data: {
      profileId: req.userId!,
      title,
      category,
      date: startOfDay(date),
      startHour,
      durationHrs: durationHrs ?? 1,
      difficulty: difficulty ?? "SHORT",
    },
  });

  res.status(201).json({ task });
}

export async function updateTask(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const existing = await prisma.task.findFirst({
    where: { id, profileId: req.userId! },
  });
  if (!existing) return res.status(404).json({ error: "Task not found" });

  const { title, category, startHour, durationHrs, difficulty, status } = req.body;

  const task = await prisma.task.update({
    where: { id },
    data: { title, category, startHour, durationHrs, difficulty, status },
  });

  res.json({ task });
}

export async function deleteTask(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const existing = await prisma.task.findFirst({
    where: { id, profileId: req.userId! },
  });
  if (!existing) return res.status(404).json({ error: "Task not found" });

  await prisma.task.delete({ where: { id } });
  res.status(204).send();
}

// Marks a task complete and awards the fixed completion bonus for its
// difficulty (section 6 of the product doc: task completion gives a
// smaller bonus on top of focus-time coins, never a duplicate reward).
export async function completeTask(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const task = await prisma.task.findFirst({
    where: { id, profileId: req.userId! },
  });
  if (!task) return res.status(404).json({ error: "Task not found" });
  if (task.status === "COMPLETED") {
    return res.status(400).json({ error: "Task already completed" });
  }

  const bonus = COMPLETION_BONUS[task.difficulty];

  const [updatedTask] = await prisma.$transaction([
    prisma.task.update({
      where: { id },
      data: { status: "COMPLETED", completedAt: new Date() },
    }),
    prisma.profile.update({
      where: { id: req.userId! },
      data: { coinBalance: { increment: bonus } },
    }),
    prisma.transaction.create({
      data: {
        profileId: req.userId!,
        type: "TASK_COMPLETION_BONUS",
        amount: bonus,
        note: `Completed "${task.title}"`,
      },
    }),
  ]);

  res.json({ task: updatedTask, coinsAwarded: bonus });
}
