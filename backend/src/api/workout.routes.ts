import express from "express";
import { addWorkout, getWorkouts } from "../controllers/workout.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").post(protect, addWorkout).get(protect, getWorkouts);

export default router;
