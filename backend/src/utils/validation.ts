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
