import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  listTasksForDay,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
} from "../controllers/tasksController";

const router = Router();
router.use(requireAuth);

router.get("/", listTasksForDay);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/:id/complete", completeTask);

export default router;
