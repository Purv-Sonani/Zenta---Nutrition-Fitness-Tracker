import express from "express";
import { addMeal, getMeals } from "../controllers/meal.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// These routes are protected. You must be logged in.
// We can chain methods: .post() to add, .get() to view.
router.route("/").post(protect, addMeal).get(protect, getMeals);

export default router;
