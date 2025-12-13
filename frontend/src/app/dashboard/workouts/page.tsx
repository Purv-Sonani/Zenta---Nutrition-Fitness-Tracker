"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaClock, FaFire } from "react-icons/fa";
import { useWorkoutStore } from "@/src/store/useWorkoutsStore";
import { Button, Loader } from "@/src/components/ui";

export default function WorkoutsPage() {
  // We extract state and actions from the store
  const { workouts, isLoading, error, fetchWorkouts } = useWorkoutStore();

  useEffect(() => {
    // The store handles the logic: "If I have data, I won't fetch again"
    fetchWorkouts();
  }, [fetchWorkouts]);

  if (isLoading && workouts.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Your Workouts</h1>
          <p className="text-gray-500 mt-1">Track your progress and history</p>
        </div>
        <Link href="/dashboard/workouts/new">
          <Button variant="primary">
            <FaPlus className="mr-2 h-4 w-4" />
            Log Workout
          </Button>
        </Link>
      </div>

      {error && <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-100">{error}</div>}

      {!isLoading && !error && workouts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <FaClock className="h-full w-full" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workouts yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by logging your first session.</p>
          <div className="mt-6">
            <Link href="/dashboard/workouts/new">
              <Button variant="outline">Create Workout</Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <div key={workout.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{workout.activity}</h3>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{new Date(workout.date).toLocaleDateString()}</span>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center">
                <FaClock className="mr-2 text-primary h-4 w-4" />
                {workout.duration} mins
              </div>
              {/* Note: Ensure your backend sends 'caloriesBurned' or 'calories' consistently */}
              {/* Based on previous chats, we standardized on 'caloriesBurned' */}
              {(workout.caloriesBurned || (workout as any).calories) && (
                <div className="flex items-center">
                  <FaFire className="mr-2 text-orange-500 h-4 w-4" />
                  {workout.caloriesBurned || (workout as any).calories} kcal
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <span className="text-sm text-primary font-medium cursor-pointer hover:underline">View Details →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
