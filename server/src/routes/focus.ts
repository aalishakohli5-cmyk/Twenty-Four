import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { startFocusSession, endFocusSession, getFocusSummary } from "../controllers/focusController";

const router = Router();
router.use(requireAuth);

router.post("/start", startFocusSession);
router.get("/summary", getFocusSummary);
router.post("/:id/end", endFocusSession);

export default router;
