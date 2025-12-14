"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FaFire, FaDumbbell, FaUtensils, FaArrowRight } from "react-icons/fa";
import { useWorkoutStore } from "@/src/store/useWorkoutsStore";
import { useNutritionStore } from "@/src/store/useNutritionStore";
import { Loader } from "@/src/components/ui";

export default function DashboardPage() {
  // 1. Access both stores
  const { workouts, fetchWorkouts, isLoading: workoutsLoading, isInitialized: workoutsInitialized } = useWorkoutStore();

  const { meals, fetchMeals, isLoading: mealsLoading, isInitialized: mealsInitialized } = useNutritionStore();

  // 2. Fetch data if not already loaded
  useEffect(() => {
    fetchWorkouts();
    fetchMeals();
  }, [fetchWorkouts, fetchMeals]);

  // 3. Calculate "Today's" Stats
  const today = new Date().toISOString().split("T")[0];

  const todaysMeals = meals.filter((m) => m.date.startsWith(today));
  const totalCaloriesIn = todaysMeals.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = todaysMeals.reduce((acc, curr) => acc + curr.protein, 0);

  const todaysWorkouts = workouts.filter((w) => w.date.startsWith(today));
  const totalCaloriesBurned = todaysWorkouts.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);
  const totalDuration = todaysWorkouts.reduce((acc, curr) => acc + curr.duration, 0);

  const recentWorkouts = workouts.slice(0, 3); // Top 3 most recent

  const isLoading = (workoutsLoading && !workoutsInitialized) || (mealsLoading && !mealsInitialized);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader className="h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Here is your daily summary.</p>
      </div>

      {/* 4. Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Calories In (Nutrition) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <p className="text-sm font-medium text-gray-500">Calories Consumed</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalCaloriesIn}</h3>
              <p className="text-sm text-gray-400 mt-1">{totalProtein}g Protein</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <FaUtensils className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Card 2: Calories Out (Workouts) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Calories Burned</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalCaloriesBurned}</h3>
              <p className="text-sm text-gray-400 mt-1">{totalDuration} mins active</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-orange-500">
              <FaFire className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Card 3: Net Balance (Calculated) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Net Balance</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalCaloriesIn - totalCaloriesBurned}</h3>
              <p className="text-sm text-gray-400 mt-1">(In - Out)</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-primary">
              <FaDumbbell className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Workouts List (Takes up 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Workouts</h2>
            <Link href="/dashboard/workouts" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            {recentWorkouts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No recent activity.</div>
            ) : (
              recentWorkouts.map((workout) => (
                <div key={workout.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                      <FaDumbbell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{workout.activity}</p>
                      <p className="text-xs text-gray-500">{new Date(workout.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{workout.duration} min</p>
                    <p className="text-xs text-gray-500">{workout.caloriesBurned} kcal</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions (Takes up 1 column) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <Link href="/dashboard/workouts/new">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary hover:ring-1 hover:ring-primary transition-all group">
                <span className="font-medium text-gray-700 group-hover:text-primary">Log Workout</span>
                <FaArrowRight className="text-gray-400 group-hover:text-primary" />
              </button>
            </Link>
            <Link href="/dashboard/nutrition/new">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:ring-1 hover:ring-green-500 transition-all group">
                <span className="font-medium text-gray-700 group-hover:text-green-600">Log Meal</span>
                <FaArrowRight className="text-gray-400 group-hover:text-green-600" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
