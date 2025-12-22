import express from "express";
import { addWorkout, getWorkouts } from "../controllers/workout.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

// These routes are protected. User must be logged in.
router.route("/").post(addWorkout).get(getWorkouts);

export default router;
