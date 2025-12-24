import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { userGoalSchema } from "../utils/validation.js";
import { AppError } from "../middleware/error.middleware.js";

/**
 * @desc    Get logged-in user's goal
 * @route   GET /api/goals
 * @access  Private
 */
export const getUserGoal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    const goal = await prisma.userGoal.findUnique({
      where: { userId: req.user.id },
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not set",
      });
    }

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create or update user goal
 * @route   POST /api/goals
 * @access  Private
 */
export const upsertUserGoal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate input
    const validation = userGoalSchema.safeParse(req.body);

    if (!validation.success) {
      throw new AppError(validation.error.issues[0].message, 400);
    }

    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    const data = validation.data;

    // 2. Upsert goal
    const goal = await prisma.userGoal.upsert({
      where: { userId: req.user.id },
      update: data,
      create: {
        ...data,
        userId: req.user.id,
      },
    });

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};
