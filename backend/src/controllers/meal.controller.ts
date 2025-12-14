import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { mealSchema } from "../utils/validation.js";
import { AppError } from "../middleware/error.middleware.js";

// @desc    Log a new meal
// @route   POST /api/meals
// @access  Private
export const addMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate Input (Zod)
    const validation = mealSchema.safeParse(req.body);

    if (!validation.success) {
      // Return the first specific validation error message
      throw new AppError(validation.error.issues[0].message, 400);
    }

    // TypeScript now knows exactly what shape 'data' is
    const data = validation.data;

    // 2. Security Check: Ensure user is attached
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    // 3. Create Meal
    const meal = await prisma.meal.create({
      data: {
        name: data.name,
        calories: data.calories,
        protein: data.protein, // Optional fields handled by Zod default(0)
        carbs: data.carbs,
        fat: data.fat,
        // If date is provided, use it; otherwise defaults to now() in Schema
        date: data.date ? new Date(data.date) : undefined,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error); // Pass errors to our Global Error Handler
  }
};

// @desc    Get all meals for the logged-in user
// @route   GET /api/meals
// @access  Private
export const getMeals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    const meals = await prisma.meal.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};
