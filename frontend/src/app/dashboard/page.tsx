"use client";

import { useEffect, useMemo } from "react";
import { FaFire, FaDumbbell, FaUtensils } from "react-icons/fa";
import { useWorkoutStore } from "@/src/store/useWorkoutsStore";
import { useNutritionStore } from "@/src/store/useNutritionStore";

import { Loader } from "@/src/components/ui";

import { evaluateDailySummary } from "@/src/domain/dashboard/evaluateDailySummary";
import { getTodaysFocus } from "@/src/domain/dashboard/getTodaysFocus";
import { getGoalSuggestion } from "@/src/domain/dashboard/getGoalSuggestion";

import { MetricCard } from "@/src/components/dashboard/MetricCard";
import { StatusBadge } from "@/src/components/dashboard/StatusBadge";
import { DailyInsight } from "@/src/components/dashboard/DailyInsight";
import { QuickActions } from "@/src/components/dashboard/QuickActions";
import { ProgressOverview } from "@/src/components/dashboard/ProgressOverview";
import { TrendSignals } from "@/src/components/dashboard/TrendSignals";
import { PatternInsights } from "@/src/components/dashboard/PatternWarnings";

import { useGoalsStore } from "@/src/store/useGoalsStore";
import { GoalSuggestionCard } from "@/src/components/dashboard/GoalSuggestionCard";

import { NutritionIntelligence } from "@/src/components/dashboard/NutritionIntelligence";

export default function DashboardPage() {
  const { workouts, fetchWorkouts, isLoading: wLoading, isInitialized: wInit } = useWorkoutStore();
  const { meals, fetchMeals, isLoading: mLoading, isInitialized: mInit } = useNutritionStore();
  const { goals, fetchGoals } = useGoalsStore();

  useEffect(() => {
    fetchWorkouts();
    fetchMeals();
    fetchGoals();
  }, [fetchWorkouts, fetchMeals, fetchGoals]);

  const today = new Date().toISOString().split("T")[0];

  const summary = useMemo(() => {
    const todaysMeals = meals.filter((m) => m.date.startsWith(today));
    const todaysWorkouts = workouts.filter((w) => w.date.startsWith(today));

    return evaluateDailySummary(
      todaysMeals.reduce((a, b) => a + b.calories, 0),
      todaysWorkouts.reduce((a, b) => a + (b.caloriesBurned || 0), 0),
      todaysMeals.reduce((a, b) => a + b.protein, 0),
      todaysWorkouts.reduce((a, b) => a + b.duration, 0),
      goals
    );
  }, [meals, workouts, today, goals]);

  const suggestion = useMemo(() => {
    if (!goals) return null;

    return getGoalSuggestion(summary.caloriesIn, summary.protein, summary.duration, goals);
  }, [summary, goals]);

  const todaysFocus = useMemo(() => {
    if (!goals) return null;

    return getTodaysFocus({
      caloriesIn: summary.caloriesIn,
      protein: summary.protein,
      workoutsTodayCount: workouts.filter((w) => w.date.startsWith(today)).length,
      currentHour: new Date().getHours(),
      goals,
    });
  }, [summary, workouts, goals, today]);

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
        <MetricCard title="Calories In" value={summary.caloriesIn} sub={`${summary.protein}g protein`} icon={<FaUtensils color="green" />} />
        <MetricCard title="Calories Out" value={summary.caloriesOut} sub={`${summary.duration} min active`} icon={<FaFire color="red" />} />
        <MetricCard title="Net Balance" value={summary.net} sub="Energy balance" icon={<FaDumbbell color="green" />} />
      </section>
      {todaysFocus && <DailyInsight focus={todaysFocus} />}

      {todaysFocus?.key !== "onTrack" && suggestion && <GoalSuggestionCard suggestion={suggestion} />}
      <QuickActions />
      <ProgressOverview />
      <TrendSignals />
      <PatternInsights />

      {/* <NutritionIntelligence /> */}
    </div>
  );
}
