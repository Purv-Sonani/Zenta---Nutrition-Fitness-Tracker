import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/client.js";
import { workoutSchema } from "../utils/validation.js";
import { AppError } from "../middleware/error.middleware.js";

// @desc    Log a new workout
// @route   POST /api/workouts
// @access  Private
export const addWorkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate Input
    const validation = workoutSchema.safeParse(req.body);

    if (!validation.success) {
      throw new AppError(validation.error.issues[0].message, 400);
    }

    const data = validation.data;

    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    // 2. Create Workout
    const workout = await prisma.workout.create({
      data: {
        activity: data.activity,
        duration: data.duration,
        caloriesBurned: data.caloriesBurned,
        date: data.date ? new Date(data.date) : undefined,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all workouts for the user
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    const workouts = await prisma.workout.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: workouts.length,
      data: workouts,
    });
  } catch (error) {
    next(error);
  }
};
