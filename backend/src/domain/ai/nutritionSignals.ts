export function generateNutritionSignals(ctx: { goal: any; last7Days: { calories: number[]; protein: number[] }; today: { calories: number; protein: number } }) {
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  return {
    protein_deficit_7d: avg(ctx.last7Days.protein) < ctx.goal.dailyProteinTarget * 0.85,

    calorie_underfuel_today: ctx.today.calories < ctx.goal.dailyCaloriesTarget * 0.6,

    protein_streak_days: ctx.last7Days.protein.filter((p) => p >= ctx.goal.dailyProteinTarget).length,
  };
}
