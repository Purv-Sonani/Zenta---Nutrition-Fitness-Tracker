import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getUserGoal, upsertUserGoal } from "../controllers/goal.controller.js";

const router = Router();

router.use(protect);

router.get("/", getUserGoal);
router.post("/", upsertUserGoal);

export default router;
