import { Request, Response } from "express";
import { prisma } from "../../prisma/client.js";

// @desc    Log a new workout
// @route   POST /api/workouts
// @access  Private
export const addWorkout = async (req: Request, res: Response) => {
  const { activity, duration, caloriesBurned, date } = req.body;

  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const workout = await prisma.workout.create({
      data: {
        activity,
        // Ensure numbers are actually numbers
        duration: parseInt(duration),
        caloriesBurned: parseInt(caloriesBurned),
        // If date is provided, convert to Date object; otherwise default is handled by Prisma or undefined
        date: date ? new Date(date) : undefined,
        userId: req.user.id,
      },
    });

    res.status(201).json(workout);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    res.status(500).json({ message });
  }
};

// @desc    Get all workouts for the user
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const workouts = await prisma.workout.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json(workouts);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    res.status(500).json({ message });
  }
};