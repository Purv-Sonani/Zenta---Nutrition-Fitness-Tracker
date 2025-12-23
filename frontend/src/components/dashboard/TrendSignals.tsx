"use client";

import { Card } from "@/src/components/ui/Card";
import { useProgressStore } from "@/src/store/useProgressStore";
import { TrendRow } from "@/src/components/dashboard/TrendSignalRow";

export function TrendSignals() {
  const { trends } = useProgressStore();

  if (!trends) return null;

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Trends</h2>

      <div className="divide-y divide-(--border-subtle)">
        <TrendRow label="Calories intake" direction={trends.caloriesTrend} />
        <TrendRow label="Protein intake" direction={trends.proteinTrend} />
        <TrendRow label="Workout consistency" direction={trends.workoutTrend} />
      </div>
    </Card>
  );
}
