import { Router } from "express";
import { balanceMeal, getNutritionInsight } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/balance", balanceMeal);
router.get("/nutrition-insight", protect, getNutritionInsight);

export default router;
