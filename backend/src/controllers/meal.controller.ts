import { Request, Response } from "express";
import { prisma } from "../../prisma/client.js";


// @desc    Log a new meal
// @route   POST /api/meals
// @access  Private
export const addMeal = async (req: Request, res: Response) => {
  const { name, calories, protein, carbs, fat } = req.body;

  try {
    // Ensure req.user exists (handled by auth middleware, but TS needs assurance)
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const meal = await prisma.meal.create({
      data: {
        name,
        calories,
        protein,
        carbs,
        fat,
        userId: req.user.id,
      },
    });

    res.status(201).json(meal);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    res.status(500).json({ message });
  }
};

// @desc    Get all meals for the logged-in user
// @route   GET /api/meals
// @access  Private
export const getMeals = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const meals = await prisma.meal.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json(meals);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    res.status(500).json({ message });
  }
};