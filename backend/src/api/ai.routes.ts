import { Router } from "express";
import { balanceMeal, getNutritionInsight } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { aiLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

// Every AI route is authenticated and rate limited, in that order:
// `protect` rejects anonymous callers before any billable work happens, and
// running it first means `aiLimiter` has a real user id to key the quota on.
router.use(protect);
router.use(aiLimiter);

router.post("/balance", balanceMeal);
router.get("/nutrition-insight", getNutritionInsight);

export default router;
