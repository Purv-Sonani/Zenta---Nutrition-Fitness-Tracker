"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/src/components/ui";
import { useGoalsStore } from "@/src/store/useGoalsStore";

export default function GoalsSetupPage() {
  const router = useRouter();
  const { upsertGoals, isLoading } = useGoalsStore();

  const [formData, setFormData] = useState({
    dailyCaloriesTarget: "",
    dailyProteinTarget: "",
    weeklyWorkoutDaysTarget: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await upsertGoals({
        dailyCaloriesTarget: Number(formData.dailyCaloriesTarget),
        dailyProteinTarget: Number(formData.dailyProteinTarget),
        weeklyWorkoutDaysTarget: Number(formData.weeklyWorkoutDaysTarget),
      });

      router.replace("/dashboard");
    } catch {
      setError("Failed to save goals. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-(--surface) border border-(--border-subtle) rounded-2xl p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Set Your Fitness Goals</h1>
          <p className="text-(--text-muted)">Zenta uses these targets to track progress and give accurate insights.</p>
        </div>

        {/* Error */}
        {error && <div className="p-3 rounded-lg bg-(--accent-danger)/10 text-(--accent-danger) text-sm">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input id="dailyCaloriesTarget" name="dailyCaloriesTarget" label="Daily Calories Target" type="number" suffix="kcal" placeholder="e.g. 2000" value={formData.dailyCaloriesTarget} onChange={handleChange} required />

          <Input id="dailyProteinTarget" name="dailyProteinTarget" label="Daily Protein Target" type="number" suffix="g" placeholder="e.g. 120" value={formData.dailyProteinTarget} onChange={handleChange} required />

          <Input id="weeklyWorkoutDaysTarget" name="weeklyWorkoutDaysTarget" label="Weekly Workout Target" type="number" placeholder="e.g. 4" value={formData.weeklyWorkoutDaysTarget} onChange={handleChange} required />

          <Button type="submit" isLoading={isLoading} className="w-full">
            Save Goals & Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
