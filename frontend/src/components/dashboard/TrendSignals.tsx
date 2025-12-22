"use client";

import { useProgressStore } from "@/src/store/useProgressStore";

export function TrendSignals() {
  const { trends } = useProgressStore();

  if (!trends) return null;

  const color = (t: string) => (t === "improving" ? "text-green-600" : t === "declining" ? "text-red-600" : "text-gray-500");

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Trends</h2>
      <ul className="text-sm space-y-1">
        <li className={color(trends.caloriesTrend)}>Calories: {trends.caloriesTrend}</li>
        <li className={color(trends.proteinTrend)}>Protein: {trends.proteinTrend}</li>
        <li className={color(trends.workoutTrend)}>Workouts: {trends.workoutTrend}</li>
      </ul>
    </div>
  );
}
