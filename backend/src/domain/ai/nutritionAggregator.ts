import { prisma } from "../../lib/prisma.js";
import { subDays, format } from "date-fns";

export async function buildNutritionContext(userId: string) {
  const today = new Date();
  const startDate = subDays(today, 6);

  const goal = await prisma.userGoal.findUnique({
    where: { userId },
  });

  if (!goal) return null;

  const meals = await prisma.meal.findMany({
    where: { userId, date: { gte: startDate } },
  });

  const dayKey = (d: Date) => format(d, "yyyy-MM-dd");

  const days = Array.from({ length: 7 }).map((_, i) => dayKey(subDays(today, 6 - i)));

  const calories: number[] = [];
  const protein: number[] = [];

  days.forEach((day) => {
    calories.push(meals.filter((m) => dayKey(m.date) === day).reduce((s, m) => s + m.calories, 0));

    protein.push(meals.filter((m) => dayKey(m.date) === day).reduce((s, m) => s + m.protein, 0));
  });

  return {
    goal,
    last7Days: { calories, protein },
    today: {
      calories: calories[6],
      protein: protein[6],
    },
  };
}
