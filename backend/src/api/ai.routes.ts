import { Router } from "express";
import { balanceMeal } from "../controllers/ai.controller.js";

const router = Router();

router.post("/balance", balanceMeal);

export default router;
