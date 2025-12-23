import { UserGoals } from "@/src/types/goals";

export type GoalSuggestionType = "protein" | "calories" | "movement";

export interface GoalSuggestion {
  type: GoalSuggestionType;
  title: string;
  message: string;
  hint?: string;
}

export function getGoalSuggestion(caloriesIn: number, protein: number, activityMinutes: number, goals: UserGoals): GoalSuggestion | null {
  // ---- Protein support ----
  if (protein < goals.dailyProteinTarget * 0.9) {
    const remaining = goals.dailyProteinTarget - protein;
    const perMeal = Math.ceil(remaining / 3);

    return {
      type: "protein",
      title: "Protein support",
      message: `Add ~${perMeal}g protein per meal to close today’s gap.`,
      hint: "Paneer, tofu, eggs, whey are easy options.",
    };
  }

  // ---- Calories support ----
  if (caloriesIn < goals.dailyCaloriesTarget * 0.85) {
    return {
      type: "calories",
      title: "Energy support",
      message: "A balanced meal can help you reach today’s energy needs.",
      hint: "Add carbs + protein together for better recovery.",
    };
  }

  // ---- Movement support ----
  if (activityMinutes === 0) {
    return {
      type: "movement",
      title: "Movement support",
      message: "Even a short session helps maintain consistency.",
      hint: "20–30 minutes is enough today.",
    };
  }

  return null;
}
