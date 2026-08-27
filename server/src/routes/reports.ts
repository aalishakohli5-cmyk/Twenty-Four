import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getDailyReport } from "../controllers/reportsController";

const router = Router();
router.use(requireAuth);

router.get("/daily", getDailyReport);

export default router;
