"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { Button, Input } from "@/src/components/ui";
import { workoutService } from "@/src/services/workout.service";
import { useWorkoutStore } from "@/src/store/useWorkoutsStore";

export default function NewWorkoutPage() {
  const router = useRouter();

  // Get the 'addWorkout' action from the store
  const addWorkoutToStore = useWorkoutStore((state) => state.addWorkout);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    activity: "",
    duration: "",
    caloriesBurned: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. DATABASE WRITE: Wait for API to confirm save
      const newWorkout = await workoutService.create({
        activity: formData.activity,
        duration: Number(formData.duration),
        caloriesBurned: formData.caloriesBurned ? Number(formData.caloriesBurned) : 0,
        date: new Date(formData.date).toISOString(),
      });

      // 2. STORE UPDATE: Add the returned workout (with ID) to global state
      // This ensures when we go back, the list is already updated.
      addWorkoutToStore(newWorkout);

      // 3. NAVIGATE: Go back to list
      //   router.push("/dashboard/workouts");
      router.back();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to create workout.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center space-x-4 border-b border-gray-100 pb-6">
        <Link href="/dashboard/workouts" className="p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <FaArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Log Workout</h1>
          <p className="text-sm text-gray-500">Record your session details below</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <Input id="activity" name="activity" label="Activity Name" placeholder="e.g. Chest Press, 5km Run" value={formData.activity} onChange={handleChange} required autoFocus />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input id="duration" name="duration" label="Duration" type="number" placeholder="0" suffix="min" value={formData.duration} onChange={handleChange} required />
            <Input id="caloriesBurned" name="caloriesBurned" label="Calories Burned (Est.)" type="number" placeholder="0" suffix="kcal" value={formData.caloriesBurned} onChange={handleChange} />
          </div>

          <div className="pt-2">
            <Input id="date" name="date" label="Date" type="date" value={formData.date} onChange={handleChange} required />
            <p className="mt-1 text-xs text-gray-400">Leave as today or select a past date to backlog.</p>
          </div>

          <div className="pt-6 flex items-center gap-4">
            <Button type="submit" isLoading={isLoading} className="flex-1 md:flex-none">
              <FaSave className="mr-2 h-4 w-4" />
              Save Workout
            </Button>

            <Link href="/dashboard/workouts" className="hidden md:block">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
