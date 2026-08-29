import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getWallet } from "../controllers/walletController";

const router = Router();
router.use(requireAuth);

router.get("/", getWallet);

export default router;
