import express from "express";
import { addMeal, getMeals } from "../controllers/meal.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

// These routes are protected. User must be logged in.
router.route("/").post(addMeal).get(getMeals);

export default router;
