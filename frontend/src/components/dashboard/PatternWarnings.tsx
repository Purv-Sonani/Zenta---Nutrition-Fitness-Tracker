"use client";

import { Card } from "@/src/components/ui/Card";
import { useProgressStore } from "@/src/store/useProgressStore";
import { PatternInsight } from "./PatternInsights";

export function PatternInsights() {
  const { patterns } = useProgressStore();

  if (!patterns || patterns.insights.length === 0) return null;

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Insights</h2>

      <div className="space-y-4">
        {patterns.insights.map((insight, index) => (
          <PatternInsight key={index} type={insight.type} title={insight.title} description={insight.description} />
        ))}
      </div>
    </Card>
  );
}
