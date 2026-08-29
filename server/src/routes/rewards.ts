import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { listRewards, purchaseReward, activateReward } from "../controllers/rewardsController";

const router = Router();
router.use(requireAuth);

router.get("/", listRewards);
router.post("/purchase", purchaseReward);
router.post("/activate", activateReward);

export default router;
