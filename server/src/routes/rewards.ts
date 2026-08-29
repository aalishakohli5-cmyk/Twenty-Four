import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { listRewards, purchaseReward, activateReward, deactivateRewardCategory } from "../controllers/rewardsController";

const router = Router();
router.use(requireAuth);

router.get("/", listRewards);
router.post("/purchase", purchaseReward);
router.post("/activate", activateReward);
router.post("/deactivate", deactivateRewardCategory);

export default router;
