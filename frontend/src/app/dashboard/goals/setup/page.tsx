"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/src/components/ui";
import { useGoalsStore } from "@/src/store/useGoalsStore";

export default function GoalsSetupPage() {
  const router = useRouter();
  const { upsertGoals, status } = useGoalsStore();

  const [formData, setFormData] = useState({
    dailyCaloriesTarget: "",
    dailyProteinTarget: "",
    weeklyWorkoutDaysTarget: "",
  });

  const [submitError, setSubmitError] = useState("");

  // ---------- Validation ----------
  const weeklyWorkoutError = useMemo(() => {
    if (formData.weeklyWorkoutDaysTarget === "") return "";

    const value = Number(formData.weeklyWorkoutDaysTarget);

    if (Number.isNaN(value)) return "Enter a valid number";
    if (value < 1 || value > 7) return "Enter a number between 1 and 7";

    return "";
  }, [formData.weeklyWorkoutDaysTarget]);

  const isFormInvalid = Boolean(weeklyWorkoutError);

  // ---------- Handlers ----------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (isFormInvalid) return;

    try {
      await upsertGoals({
        dailyCaloriesTarget: Number(formData.dailyCaloriesTarget),
        dailyProteinTarget: Number(formData.dailyProteinTarget),
        weeklyWorkoutDaysTarget: Number(formData.weeklyWorkoutDaysTarget),
      });

      router.replace("/dashboard");
    } catch {
      setSubmitError("Failed to save goals. Please try again.");
    }
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-(--surface) border border-(--border-subtle) rounded-2xl p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Set Your Fitness Goals</h1>
          <p className="text-(--text-muted)">Zenta uses these targets to track progress and give accurate insights.</p>
        </div>

        {/* Submit Error */}
        {submitError && <div className="p-3 rounded-lg bg-(--accent-danger)/10 text-(--accent-danger) text-sm">{submitError}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input id="dailyCaloriesTarget" name="dailyCaloriesTarget" label="Daily Calories Target" type="number" suffix="kcal" placeholder="e.g. 2000" value={formData.dailyCaloriesTarget} onChange={handleChange} required />

          <Input id="dailyProteinTarget" name="dailyProteinTarget" label="Daily Protein Target" type="number" suffix="g" placeholder="e.g. 120" value={formData.dailyProteinTarget} onChange={handleChange} required />

          <Input id="weeklyWorkoutDaysTarget" name="weeklyWorkoutDaysTarget" label="Weekly Workout Target" type="number" placeholder="e.g. 4" value={formData.weeklyWorkoutDaysTarget} onChange={handleChange} error={weeklyWorkoutError} required />

          <Button type="submit" isLoading={status === "loading"} disabled={isFormInvalid} className="w-full">
            Save Goals & Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
