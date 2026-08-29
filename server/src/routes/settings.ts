import { Router } from "express";
import { endPause, getSettings, startPause } from "../controllers/settingsController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);
router.get("/", getSettings);
router.post("/pause", startPause);
router.delete("/pause", endPause);
export default router;
