"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaClock, FaFire } from "react-icons/fa";
import { useWorkoutStore } from "@/src/store/useWorkoutsStore";
import { Button, Loader } from "@/src/components/ui";

export default function WorkoutsPage() {
  const { workouts, isLoading, error, fetchWorkouts } = useWorkoutStore();

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  if (isLoading && new Set(workouts.map((w) => new Date(w.date).toDateString())).size === 0) {
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
          <h1 className="text-2xl font-bold text-(--foreground)">Your Workouts</h1>
          <p className="text-(--text-muted) mt-1">Track your progress and history</p>
        </div>
        <Link href="/dashboard/workouts/new">
          <Button variant="primary">
            <FaPlus className="mr-2 h-4 w-4" />
            Log Workout
          </Button>
        </Link>
      </div>

      {error && <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-100">{error}</div>}

      {!isLoading && !error && new Set(workouts.map((w) => new Date(w.date).toDateString())).size === 0 && (
        <div className="text-center py-20 bg-(--surface) rounded-xl border border-dashed border-(--border-strong)">
          <div className="mx-auto h-12 w-12 text-(--text-muted)">
            <FaClock className="h-full w-full" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-(--foreground)">No workouts yet</h3>
          <p className="mt-1 text-sm text-(--text-muted)">Get started by logging your first session.</p>
          <div className="mt-6">
            <Link href="/dashboard/workouts/new">
              <Button variant="outline">Create Workout</Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <div key={workout.id} className="bg-(--surface) rounded-xl shadow-sm border border-(--border-subtle) p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-(--foreground) line-clamp-1">{workout.activity}</h3>
              <span className="text-xs font-medium text-(--text-muted) bg-(--surface-muted) px-2 py-1 rounded-full">{new Date(workout.date).toLocaleDateString()}</span>
            </div>

            <div className="space-y-3 text-sm text-(--text-muted)">
              <div className="flex items-center">
                <FaClock className="mr-2 text-primary h-4 w-4" />
                {workout.duration} mins
              </div>

              {(workout.caloriesBurned || (workout as any).calories) && (
                <div className="flex items-center">
                  <FaFire className="mr-2 text-orange-500 h-4 w-4" />
                  {workout.caloriesBurned || (workout as any).calories} kcal
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-(--border-subtle) flex justify-end">
              <span className="text-sm text-primary font-medium cursor-pointer hover:underline">View Details →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
