"use client";

import { useState } from "react";
import { Button, Input } from "@/src/components/ui";
import { UserGoals } from "@/src/types/goals";

interface Props {
  initialValues?: UserGoals;
  onSubmit: (data: UserGoals) => Promise<void>;
  submitLabel?: string;
}

export function GoalForm({ initialValues, onSubmit, submitLabel = "Save Goals" }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<UserGoals>({
    dailyCaloriesTarget: initialValues?.dailyCaloriesTarget ?? 2000,
    dailyProteinTarget: initialValues?.dailyProteinTarget ?? 120,
    weeklyWorkoutDaysTarget: initialValues?.weeklyWorkoutDaysTarget ?? 4,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const num = Number(value);

    if (Number.isNaN(num)) return;

    // HARD CONSTRAINT: 1–7 workouts only
    if (name === "weeklyWorkoutDaysTarget") {
      const clamped = Math.min(7, Math.max(1, num));
      setForm((prev) => ({ ...prev, weeklyWorkoutDaysTarget: clamped }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: num }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err?.message || "Failed to save goals");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-lg bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</div>}

      <Input label="Daily Calories Target" name="dailyCaloriesTarget" type="number" min={1000} step={50} suffix="kcal" value={form.dailyCaloriesTarget} onChange={handleChange} required />

      <Input label="Daily Protein Target" name="dailyProteinTarget" type="number" min={30} step={5} suffix="g" value={form.dailyProteinTarget} onChange={handleChange} required />

      <Input label="Weekly Workout Days" name="weeklyWorkoutDaysTarget" type="number" min={1} max={7} step={1} suffix="days" value={form.weeklyWorkoutDaysTarget} onChange={handleChange} required />

      <Button type="submit" isLoading={isLoading} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
