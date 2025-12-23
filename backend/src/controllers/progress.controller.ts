import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { subDays, eachDayOfInterval, formatISO, format } from "date-fns";
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
    const WORKOUT_TARGET = goal?.weeklyWorkoutDaysTarget ?? 5;

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
const TREND_THRESHOLD = 0.1; // 10% change to count as signal

function getDirection(previous: number, recent: number): "up" | "down" | "flat" {
  if (previous === 0) return "flat";

  const delta = (recent - previous) / previous;

  if (delta > TREND_THRESHOLD) return "up";
  if (delta < -TREND_THRESHOLD) return "down";
  return "flat";
}
type TrendDirection = "improving" | "declining" | "stable" | "insufficient_data";

const getDirectionTrendSignals = (prev: number, recent: number): TrendDirection => {
  if (prev === 0 && recent === 0) return "insufficient_data";
  if (recent > prev * 1.05) return "improving";
  if (recent < prev * 0.95) return "declining";
  return "stable";
};

export const getTrendSignals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    const today = new Date();
    const startDate = subDays(today, 6);

    const goal = await prisma.userGoal.findUnique({
      where: { userId: req.user.id },
    });

    if (!goal) {
      return res.status(200).json({
        success: true,
        data: {
          caloriesTrend: "insufficient_data",
          proteinTrend: "insufficient_data",
          workoutTrend: "insufficient_data",
        },
      });
    }

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

    // ---- Build day buckets (timezone safe) ----
    const days = eachDayOfInterval({ start: startDate, end: today });
    const dayKey = (d: Date) => format(d, "yyyy-MM-dd");

    const mealMap = new Map<string, { calories: number; protein: number }>();
    const workoutMap = new Map<string, boolean>();

    for (const day of days) {
      mealMap.set(dayKey(day), { calories: 0, protein: 0 });
      workoutMap.set(dayKey(day), false);
    }

    meals.forEach((m) => {
      const key = dayKey(m.date);
      const current = mealMap.get(key);
      if (current) {
        current.calories += m.calories;
        current.protein += m.protein;
      }
    });

    workouts.forEach((w) => {
      workoutMap.set(dayKey(w.date), true);
    });

    const values = Array.from(mealMap.values());
    const workoutDays = Array.from(workoutMap.values());

    // Split window: first 3 vs last 3
    const prevMeals = values.slice(0, 3);
    const recentMeals = values.slice(3);

    const prevWorkouts = workoutDays.slice(0, 3).filter(Boolean).length;
    const recentWorkouts = workoutDays.slice(3).filter(Boolean).length;

    const caloriesTrend = getDirectionTrendSignals(
      prevMeals.reduce((s, d) => s + d.calories, 0),
      recentMeals.reduce((s, d) => s + d.calories, 0)
    );

    const proteinTrend = getDirectionTrendSignals(
      prevMeals.reduce((s, d) => s + d.protein, 0),
      recentMeals.reduce((s, d) => s + d.protein, 0)
    );

    const workoutTrend = getDirectionTrendSignals(prevWorkouts, recentWorkouts);

    res.status(200).json({
      success: true,
      data: {
        caloriesTrend,
        proteinTrend,
        workoutTrend,
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
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    const today = new Date();
    const startDate = subDays(today, 6); // last 7 days (inclusive)

    const goal = await prisma.userGoal.findUnique({
      where: { userId: req.user.id },
    });

    if (!goal) {
      return res.status(200).json({
        success: true,
        data: { insights: [] },
      });
    }

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

    // ---- Build day buckets (timezone safe) ----
    const days = eachDayOfInterval({ start: startDate, end: today });
    const dayKey = (d: Date) => format(d, "yyyy-MM-dd");

    const mealByDay = new Map<string, { calories: number; protein: number }>();
    const workoutByDay = new Set<string>();

    days.forEach((d) => mealByDay.set(dayKey(d), { calories: 0, protein: 0 }));

    meals.forEach((m) => {
      const key = dayKey(m.date);
      const current = mealByDay.get(key);
      if (current) {
        current.calories += m.calories;
        current.protein += m.protein;
      }
    });

    workouts.forEach((w) => {
      workoutByDay.add(dayKey(w.date));
    });

    // ---- Consider only days with ANY activity ----
    const activeDays = Array.from(mealByDay.entries()).filter(([_, v]) => v.calories > 0 || v.protein > 0);

    if (activeDays.length < 3) {
      return res.status(200).json({
        success: true,
        data: { insights: [] },
      });
    }

    const insights: {
      type: "protein" | "workout";
      title: string;
      description: string;
    }[] = [];

    // ==============================
    // Protein consistency insight
    // ==============================
    const proteinTarget = goal.dailyProteinTarget;

    const proteinHitDays = activeDays.filter(([_, v]) => v.protein >= proteinTarget).length;

    const proteinMissed = activeDays.length - proteinHitDays;
    const proteinMissRatio = proteinMissed / activeDays.length;

    if (proteinMissRatio >= 0.4) {
      insights.push({
        type: "protein",
        title: "Protein intake inconsistent",
        description: `Protein target met on ${proteinHitDays} of ${activeDays.length} logged days. Consistent protein intake supports recovery and muscle maintenance.`,
      });
    }

    // ==============================
    // Workout consistency insight
    // ==============================
    const workoutDaysLogged = workoutByDay.size;
    const expectedWorkoutDays = Math.min(goal.weeklyWorkoutDaysTarget, activeDays.length);

    if (expectedWorkoutDays >= 3 && workoutDaysLogged / expectedWorkoutDays < 0.6) {
      insights.push({
        type: "workout",
        title: "Workout consistency dropping",
        description: `You trained on ${workoutDaysLogged} of the last ${activeDays.length} active days. Maintaining regular sessions is more important than intensity.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: { insights },
    });
  } catch (error) {
    next(error);
  }
};
