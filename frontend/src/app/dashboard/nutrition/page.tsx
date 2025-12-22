"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaUtensils } from "react-icons/fa";
import { useNutritionStore } from "@/src/store/useNutritionStore";
import { Button, Loader } from "@/src/components/ui";

export default function NutritionPage() {
  const { meals, isLoading, error, fetchMeals } = useNutritionStore();

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  if (isLoading && meals.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader className="h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--foreground)">Nutrition Log</h1>
          <p className="text-(--text-muted) mt-1">Track your calories and macros</p>
        </div>
        <Link href="/dashboard/nutrition/new">
          <Button variant="primary">
            <FaPlus className="mr-2 h-4 w-4" />
            Log Meal
          </Button>
        </Link>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">{error}</div>}

      {!isLoading && !error && meals.length === 0 && (
        <div className="text-center py-20 bg-(--surface) rounded-xl border border-dashed border-(--border-strong)">
          <div className="mx-auto h-12 w-12 text-(--text-muted)">
            <FaUtensils className="h-full w-full" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-(--foreground)">No meals logged</h3>
          <p className="mt-1 text-sm text-(--text-muted)">Start tracking your food intake.</p>
          <div className="mt-6">
            <Link href="/dashboard/nutrition/new">
              <Button variant="outline">Log First Meal</Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {meals.map((meal) => (
          <div key={meal.id} className="bg-(--surface) rounded-xl shadow-sm border border-(--border-subtle) p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition-shadow">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <h3 className="font-semibold text-lg text-(--foreground)">{meal.name}</h3>
                <span className="text-xs text-(--text-muted) bg-(--surface-muted) px-2 py-1 rounded-full">
                  {new Date(meal.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-(--text-muted) mt-1">{new Date(meal.date).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center gap-4 sm:gap-8 text-sm">
              <div className="text-center">
                <span className="block font-bold text-(--foreground)">{meal.calories}</span>
                <span className="text-xs text-(--text-muted)">kcal</span>
              </div>

              <div className="h-8 w-px bg-(--border-subtle) hidden sm:block"></div>

              <div className="flex gap-4">
                <div className="text-center">
                  <span className="block font-medium text-primary">{meal.protein}g</span>
                  <span className="text-xs text-(--text-muted)">Pro</span>
                </div>
                <div className="text-center">
                  <span className="block font-medium text-green-600">{meal.carbs}g</span>
                  <span className="text-xs text-(--text-muted)">Carb</span>
                </div>
                <div className="text-center">
                  <span className="block font-medium text-yellow-600">{meal.fat}g</span>
                  <span className="text-xs text-(--text-muted)">Fat</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
