"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/src/store/useProgressStore";
import { StatCard } from "@/src/components/ui/StatCard";
import { ProgressBar } from "@/src/components/ui/ProgressBar";

export function ProgressOverview() {
  const { weeklySummary, fetchProgress } = useProgressStore();

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  if (!weeklySummary) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Weekly Progress</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Calories Adherence" value={`${weeklySummary.caloriesAdherencePercent}%`} />
        <StatCard label="Protein Consistency" value={`${weeklySummary.proteinConsistencyDays}/7`} />
        <StatCard label="Workout Adherence" value={`${weeklySummary.workoutAdherencePercent}%`} />
      </div>

      <ProgressBar value={weeklySummary.caloriesAdherencePercent} />
    </div>
  );
}
