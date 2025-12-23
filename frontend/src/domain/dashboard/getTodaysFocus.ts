import { UserGoals } from "@/src/types/goals";

export type TodaysFocusKey = "protein" | "calories" | "movement" | "onTrack";

export interface TodaysFocus {
  key: TodaysFocusKey;
  title: string;
  description: string;
  cta?: "logMeal" | "logWorkout";
}

interface FocusInput {
  caloriesIn: number;
  protein: number;
  workoutsTodayCount: number;
  currentHour: number;
  goals: UserGoals;
}

// ---- Explicit thresholds (easy to tune later) ----
const PROTEIN_MIN_RATIO = 0.8; // 80%
const CALORIES_MIN_RATIO = 0.75; // 75%
const LATE_HOUR = 21; // 9 PM

export function getTodaysFocus({ caloriesIn, protein, workoutsTodayCount, currentHour, goals }: FocusInput): TodaysFocus {
  const proteinTarget = goals.dailyProteinTarget;
  const calorieTarget = goals.dailyCaloriesTarget;

  const proteinDeficit = proteinTarget - protein;
  const calorieDeficit = calorieTarget - caloriesIn;

  // ---- Protein priority (only if time remains) ----
  if (protein < proteinTarget * PROTEIN_MIN_RATIO && currentHour < LATE_HOUR) {
    return {
      key: "protein",
      title: "Protein is your priority today",
      description: `You’re ${proteinDeficit}g short. One high-protein meal will meaningfully improve recovery.`,
      cta: "logMeal",
    };
  }

  // ---- Calories next ----
  if (caloriesIn < calorieTarget * CALORIES_MIN_RATIO && currentHour < LATE_HOUR) {
    return {
      key: "calories",
      title: "You’re under-fueled today",
      description: `You’re about ${calorieDeficit} kcal below target. A balanced meal can fix this.`,
      cta: "logMeal",
    };
  }

  // ---- Workout logic (goal-aware) ----
  const expectedWorkoutsPerDay = goals.weeklyWorkoutDaysTarget / 7;

  if (workoutsTodayCount === 0 && expectedWorkoutsPerDay >= 0.5 && currentHour < 20) {
    return {
      key: "movement",
      title: "Protect your workout consistency",
      description: "A short session today helps maintain weekly momentum. Duration matters less than showing up.",
      cta: "logWorkout",
    };
  }

  // ---- All aligned ----
  return {
    key: "onTrack",
    title: "You’re aligned today",
    description: "Calories, protein, and activity are within healthy ranges. Stay consistent.",
  };
}
