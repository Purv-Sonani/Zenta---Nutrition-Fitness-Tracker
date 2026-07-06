import { User } from "@/src/types/auth";
import { Meal } from "@/src/types/nutrition";
import { Workout } from "@/src/types/workout";
import { UserGoals } from "@/src/types/goals";
import { WeeklySummary, TrendSignals, PatternResponse } from "@/src/types/progress";

// ─── Helpers ───────────────────────────────────────────────
function daysAgo(n: number, hour = 12): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

const today = () => daysAgo(0);

// ─── Demo User ─────────────────────────────────────────────
export const DEMO_USER: User = {
  id: "demo-user-001",
  username: "Demo User",
  email: "demo@zenta.app",
  createdAt: daysAgo(30),
};

// ─── Demo Goals ────────────────────────────────────────────
export const DEMO_GOALS: UserGoals = {
  dailyCaloriesTarget: 2200,
  dailyProteinTarget: 140,
  weeklyWorkoutDaysTarget: 5,
};

// ─── Demo Meals ────────────────────────────────────────────
export const DEMO_MEALS: Meal[] = [
  // Today
  {
    id: "demo-meal-01",
    name: "Oatmeal with Berries & Almonds",
    calories: 380,
    protein: 14,
    carbs: 52,
    fat: 12,
    date: daysAgo(0, 8),
    userId: "demo-user-001",
  },
  {
    id: "demo-meal-02",
    name: "Grilled Chicken Salad",
    calories: 520,
    protein: 42,
    carbs: 18,
    fat: 28,
    date: daysAgo(0, 13),
    userId: "demo-user-001",
  },
  // Yesterday
  {
    id: "demo-meal-03",
    name: "Paneer Tikka with Naan",
    calories: 610,
    protein: 32,
    carbs: 48,
    fat: 30,
    date: daysAgo(1, 13),
    userId: "demo-user-001",
  },
  {
    id: "demo-meal-04",
    name: "Banana Protein Shake",
    calories: 290,
    protein: 28,
    carbs: 34,
    fat: 6,
    date: daysAgo(1, 7),
    userId: "demo-user-001",
  },
  {
    id: "demo-meal-05",
    name: "Salmon with Quinoa & Veggies",
    calories: 580,
    protein: 40,
    carbs: 42,
    fat: 22,
    date: daysAgo(1, 19),
    userId: "demo-user-001",
  },
  // 2 days ago
  {
    id: "demo-meal-06",
    name: "Egg White Omelette & Toast",
    calories: 340,
    protein: 26,
    carbs: 30,
    fat: 10,
    date: daysAgo(2, 8),
    userId: "demo-user-001",
  },
  {
    id: "demo-meal-07",
    name: "Dal + Rice + Sabzi",
    calories: 520,
    protein: 18,
    carbs: 72,
    fat: 14,
    date: daysAgo(2, 13),
    userId: "demo-user-001",
  },
  // 3 days ago
  {
    id: "demo-meal-08",
    name: "Greek Yogurt Parfait",
    calories: 310,
    protein: 22,
    carbs: 38,
    fat: 8,
    date: daysAgo(3, 9),
    userId: "demo-user-001",
  },
  {
    id: "demo-meal-09",
    name: "Chicken Biryani",
    calories: 680,
    protein: 36,
    carbs: 76,
    fat: 24,
    date: daysAgo(3, 19),
    userId: "demo-user-001",
  },
  // 5 days ago
  {
    id: "demo-meal-10",
    name: "Avocado Toast with Eggs",
    calories: 420,
    protein: 20,
    carbs: 32,
    fat: 24,
    date: daysAgo(5, 9),
    userId: "demo-user-001",
  },
  {
    id: "demo-meal-11",
    name: "Pasta Primavera",
    calories: 480,
    protein: 16,
    carbs: 64,
    fat: 16,
    date: daysAgo(5, 19),
    userId: "demo-user-001",
  },
];

// ─── Demo Workouts ─────────────────────────────────────────
export const DEMO_WORKOUTS: Workout[] = [
  {
    id: "demo-workout-01",
    activity: "Morning Run",
    duration: 35,
    caloriesBurned: 320,
    date: daysAgo(0, 7),
    userId: "demo-user-001",
    createdAt: daysAgo(0, 7),
    updatedAt: daysAgo(0, 7),
  },
  {
    id: "demo-workout-02",
    activity: "Upper Body Strength",
    duration: 50,
    caloriesBurned: 280,
    date: daysAgo(1, 17),
    userId: "demo-user-001",
    createdAt: daysAgo(1, 17),
    updatedAt: daysAgo(1, 17),
  },
  {
    id: "demo-workout-03",
    activity: "Yoga & Stretching",
    duration: 40,
    caloriesBurned: 150,
    date: daysAgo(2, 7),
    userId: "demo-user-001",
    createdAt: daysAgo(2, 7),
    updatedAt: daysAgo(2, 7),
  },
  {
    id: "demo-workout-04",
    activity: "Leg Day",
    duration: 55,
    caloriesBurned: 340,
    date: daysAgo(3, 18),
    userId: "demo-user-001",
    createdAt: daysAgo(3, 18),
    updatedAt: daysAgo(3, 18),
  },
  {
    id: "demo-workout-05",
    activity: "HIIT Circuit",
    duration: 30,
    caloriesBurned: 380,
    date: daysAgo(4, 7),
    userId: "demo-user-001",
    createdAt: daysAgo(4, 7),
    updatedAt: daysAgo(4, 7),
  },
  {
    id: "demo-workout-06",
    activity: "Swimming",
    duration: 45,
    caloriesBurned: 400,
    date: daysAgo(5, 16),
    userId: "demo-user-001",
    createdAt: daysAgo(5, 16),
    updatedAt: daysAgo(5, 16),
  },
  {
    id: "demo-workout-07",
    activity: "Cycling",
    duration: 60,
    caloriesBurned: 450,
    date: daysAgo(6, 8),
    userId: "demo-user-001",
    createdAt: daysAgo(6, 8),
    updatedAt: daysAgo(6, 8),
  },
  {
    id: "demo-workout-08",
    activity: "Core & Abs",
    duration: 25,
    caloriesBurned: 180,
    date: daysAgo(6, 18),
    userId: "demo-user-001",
    createdAt: daysAgo(6, 18),
    updatedAt: daysAgo(6, 18),
  },
];

// ─── Demo Progress ─────────────────────────────────────────
export const DEMO_WEEKLY_SUMMARY: WeeklySummary = {
  caloriesAdherencePercent: 82,
  proteinConsistencyDays: 5,
  workoutAdherencePercent: 71,
};

export const DEMO_TRENDS: TrendSignals = {
  caloriesTrend: "improving",
  proteinTrend: "stable",
  workoutTrend: "improving",
};

export const DEMO_PATTERNS: PatternResponse = {
  insights: [
    {
      type: "protein",
      title: "Protein dips on weekends",
      description:
        "Your protein intake drops by ~30% on Saturdays and Sundays. Consider prepping a high-protein snack like Greek yogurt or a shake for those days.",
    },
    {
      type: "workout",
      title: "Consistent morning workouts",
      description:
        "You tend to complete more workouts when you schedule them before noon. Keep leveraging your morning energy!",
    },
  ],
};
