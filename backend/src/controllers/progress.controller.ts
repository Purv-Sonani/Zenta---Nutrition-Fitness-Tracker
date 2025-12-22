import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { subDays } from "date-fns";
import { AppError } from "../middleware/error.middleware.js";
import { progressRangeSchema, trendsQuerySchema, patternsQuerySchema } from "../utils/validation.js";

/**
 * @desc    Get weekly / monthly adherence summary
 * @route   GET /api/progress/weekly-summary
 * @access  Private
 */
export const getWeeklySummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate query params
    const validation = progressRangeSchema.safeParse(req.query);

    if (!validation.success) {
      throw new AppError(validation.error.issues[0].message, 400);
    }

    const { range } = validation.data;
    const days = Number(range);

    // 2. Auth check
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    const startDate = subDays(new Date(), days);

    // 3. Fetch data
    const [meals, workouts] = await Promise.all([
      prisma.meal.findMany({
        where: {
          userId: req.user.id,
          date: { gte: startDate },
        },
      }),
      prisma.workout.findMany({
        where: {
          userId: req.user.id,
          date: { gte: startDate },
        },
      }),
    ]);

    // ---- Calculations ----

    const goal = await prisma.userGoal.findUnique({
      where: { userId: req.user.id },
    });

    const DAILY_CALORIES_TARGET = goal?.dailyCaloriesTarget ?? 2000;
    const PROTEIN_THRESHOLD = goal?.dailyProteinTarget ?? 20;
    const WORKOUT_TARGET = goal?.weeklyWorkoutTarget ?? 5;

    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const maxCalories = days * DAILY_CALORIES_TARGET;

    const caloriesAdherencePercent = Math.min(Math.round((totalCalories / maxCalories) * 100), 100);

    const proteinDays = new Set(meals.filter((m) => m.protein >= PROTEIN_THRESHOLD).map((m) => m.date.toDateString())).size;

    const workoutDays = new Set(workouts.map((w) => w.date.toDateString())).size;

    const workoutAdherencePercent = Math.round((workoutDays / WORKOUT_TARGET) * 100);

    // 4. Response
    res.status(200).json({
      success: true,
      data: {
        caloriesAdherencePercent,
        proteinConsistencyDays: proteinDays,
        workoutAdherencePercent,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get directional trend signals
 * @route   GET /api/progress/trends
 * @access  Private
 */
export const getTrendSignals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate query params
    const validation = trendsQuerySchema.safeParse(req.query);

    if (!validation.success) {
      throw new AppError(validation.error.issues[0].message, 400);
    }

    const { window } = validation.data;
    const days = window === "monthly" ? 30 : 7;

    // 2. Auth check
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    const currentStart = subDays(new Date(), days);
    const previousStart = subDays(new Date(), days * 2);

    // 3. Fetch data
    const [currentMeals, previousMeals, currentWorkouts, previousWorkouts] = await Promise.all([
      prisma.meal.findMany({
        where: {
          userId: req.user.id,
          date: { gte: currentStart },
        },
      }),
      prisma.meal.findMany({
        where: {
          userId: req.user.id,
          date: { gte: previousStart, lt: currentStart },
        },
      }),
      prisma.workout.findMany({
        where: {
          userId: req.user.id,
          date: { gte: currentStart },
        },
      }),
      prisma.workout.findMany({
        where: {
          userId: req.user.id,
          date: { gte: previousStart, lt: currentStart },
        },
      }),
    ]);

    const sum = (arr: any[], key: string) => arr.reduce((s, item) => s + item[key], 0);

    const resolveTrend = (current: number, previous: number) => {
      if (current > previous) return "improving";
      if (current < previous) return "declining";
      return "stable";
    };

    // 4. Response
    res.status(200).json({
      success: true,
      data: {
        caloriesTrend: resolveTrend(sum(currentMeals, "calories"), sum(previousMeals, "calories")),
        proteinTrend: resolveTrend(sum(currentMeals, "protein"), sum(previousMeals, "protein")),
        workoutTrend: resolveTrend(currentWorkouts.length, previousWorkouts.length),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Detect warnings & behavior patterns
 * @route   GET /api/progress/patterns
 * @access  Private
 */
export const getPatterns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate query params (future-proof)
    const validation = patternsQuerySchema.safeParse(req.query);

    if (!validation.success) {
      throw new AppError(validation.error.issues[0].message, 400);
    }

    // 2. Auth check
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    const startDate = subDays(new Date(), 7);

    // 3. Fetch data
    const [meals, workouts] = await Promise.all([
      prisma.meal.findMany({
        where: {
          userId: req.user.id,
          date: { gte: startDate },
        },
      }),
      prisma.workout.findMany({
        where: {
          userId: req.user.id,
          date: { gte: startDate },
        },
      }),
    ]);

    const warnings: string[] = [];

    // ---- Protein pattern ----
    const PROTEIN_THRESHOLD = 20;
    const proteinDays = new Set(meals.filter((m) => m.protein >= PROTEIN_THRESHOLD).map((m) => m.date.toDateString())).size;

    const proteinMissedDays = 7 - proteinDays;

    if (proteinMissedDays >= 3) {
      warnings.push(`Protein missed ${proteinMissedDays}/7 days`);
    }

    // ---- Workout pattern ----
    if (workouts.length < 3) {
      warnings.push("Workout frequency declining");
    }

    // 4. Response
    res.status(200).json({
      success: true,
      data: {
        warnings,
      },
    });
  } catch (error) {
    next(error);
  }
};
