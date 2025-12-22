import { z } from "zod";

// Schema for User Registration
export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for User Login
export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

// Schema for Adding a Meal
export const mealSchema = z.object({
  name: z.string().min(1, "Meal name is required"),
  calories: z.number().positive("Calories must be a positive number"),
  protein: z.number().nonnegative().optional().default(0),
  carbs: z.number().nonnegative().optional().default(0),
  fat: z.number().nonnegative().optional().default(0),
  date: z.iso.datetime().optional(), // Expect ISO string if provided
});

// Schema for Adding a Workout
export const workoutSchema = z.object({
  activity: z.string().min(1, "Activity name is required"),
  duration: z.number().positive("Duration must be positive (minutes)"),
  caloriesBurned: z.number().positive(),
  date: z.iso.datetime().optional(),
});

// Generic date range validation
export const dateRangeQuerySchema = z.object({
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
});

// Weekly / Monthly range selector
export const progressRangeSchema = z.object({
  range: z.enum(["7", "30"]).optional().default("7"),
});

// Trends query (future-proof)
export const trendsQuerySchema = z.object({
  window: z.enum(["weekly", "monthly"]).optional().default("weekly"),
});

// Patterns query (no params now, but locked)
export const patternsQuerySchema = z.object({});

// User Goals
export const userGoalSchema = z.object({
  dailyCaloriesTarget: z.number().positive(),
  dailyProteinTarget: z.number().positive(),
  weeklyWorkoutTarget: z.number().positive().max(14),
});
