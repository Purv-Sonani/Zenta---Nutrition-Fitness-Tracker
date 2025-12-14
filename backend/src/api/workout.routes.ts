import express from "express";
import { addWorkout, getWorkouts } from "../controllers/workout.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// These routes are protected. User must be logged in.
router.route("/").post(protect, addWorkout).get(protect, getWorkouts);

export default router;
