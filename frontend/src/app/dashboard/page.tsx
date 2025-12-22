"use client";

import { useEffect, useMemo } from "react";
import { FaFire, FaDumbbell, FaUtensils } from "react-icons/fa";
import { useWorkoutStore } from "@/src/store/useWorkoutsStore";
import { useNutritionStore } from "@/src/store/useNutritionStore";
import { Loader } from "@/src/components/ui";
import { evaluateDailySummary } from "@/src/domain/dashboard/evaluateDailySummary";
import { MetricCard } from "@/src/components/dashboard/MetricCard";
import { StatusBadge } from "@/src/components/dashboard/StatusBadge";
import { DailyInsight } from "@/src/components/dashboard/DailyInsight";
import { QuickActions } from "@/src/components/dashboard/QuickActions";

export default function DashboardPage() {
  const { workouts, fetchWorkouts, isLoading: wLoading, isInitialized: wInit } = useWorkoutStore();
  const { meals, fetchMeals, isLoading: mLoading, isInitialized: mInit } = useNutritionStore();

  useEffect(() => {
    fetchWorkouts();
    fetchMeals();
  }, [fetchWorkouts, fetchMeals]);

  const today = new Date().toISOString().split("T")[0];

  const summary = useMemo(() => {
    const todaysMeals = meals.filter((m) => m.date.startsWith(today));
    const todaysWorkouts = workouts.filter((w) => w.date.startsWith(today));

    return evaluateDailySummary(
      todaysMeals.reduce((a, b) => a + b.calories, 0),
      todaysWorkouts.reduce((a, b) => a + (b.caloriesBurned || 0), 0),
      todaysMeals.reduce((a, b) => a + b.protein, 0),
      todaysWorkouts.reduce((a, b) => a + b.duration, 0)
    );
  }, [meals, workouts, today]);

  if ((wLoading && !wInit) || (mLoading && !mInit)) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader className="h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Today</h1>
          <p className="opacity-70">Goal alignment snapshot</p>
        </div>
        <StatusBadge status={summary.status} />
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Calories In" value={summary.caloriesIn} sub={`${summary.protein}g protein`} icon={<FaUtensils />} />
        <MetricCard title="Calories Out" value={summary.caloriesOut} sub={`${summary.duration} min active`} icon={<FaFire />} />
        <MetricCard title="Net Balance" value={summary.net} sub="Energy balance" icon={<FaDumbbell />} />
      </section>

      <DailyInsight status={summary.status} />

      <QuickActions />
    </div>
  );
}
