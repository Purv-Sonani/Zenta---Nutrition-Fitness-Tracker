import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getWeeklySummary, getTrendSignals, getPatterns } from "../controllers/progress.controller.js";

const router = Router();

router.use(protect);

router.get("/weekly-summary", getWeeklySummary);
router.get("/trends", getTrendSignals);
router.get("/patterns", getPatterns);

export default router;
