"use client";

import { useEffect } from "react";
import { useNutritionAIStore } from "@/src/store/useNutritionAIStore";
import { Loader, AlertTriangle, Brain, ArrowUpRight, Info } from "lucide-react";

function confidenceLabel(value: number) {
  if (value >= 0.8) return "High";
  if (value >= 0.6) return "Medium";
  return "Low";
}

export function NutritionIntelligence() {
  const { insight, fetchInsight, isLoading, error } = useNutritionAIStore();

  useEffect(() => {
    fetchInsight();
  }, [fetchInsight]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader className="w-4 h-4 animate-spin" />
        Analyzing nutrition patterns…
      </div>
    );
  }

  if (error || !insight) return null;

  return (
    <div className="rounded-xl border border-(--border-subtle) bg-(--surface) p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-indigo-500" />
        <h3 className="font-semibold text-lg">Nutrition Intelligence</h3>
      </div>

      {/* Diagnosis */}
      <div>
        <p className="text-sm text-(--text-muted)">Diagnosis</p>
        <p className="font-medium">{insight.diagnosis}</p>
        <p className="text-xs opacity-70 mt-1">
          Confidence: {confidenceLabel(insight.confidence)} ({Math.round(insight.confidence * 100)}%)
        </p>
      </div>

      {/* Root Causes */}
      {insight.root_causes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-1">Root Causes</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {insight.root_causes.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      <div>
        <p className="text-sm font-medium mb-2">Recommended Actions</p>
        <div className="space-y-2">
          {insight.recommendations.map((r, i) => (
            <div key={i} className="flex gap-2 items-start rounded-lg bg-indigo-50 p-3">
              <ArrowUpRight className="w-4 h-4 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{r.action}</p>
                <p className="text-xs text-indigo-700">Impact: {r.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction */}
      <div className="rounded-lg bg-(--surface-muted) p-3">
        <p className="text-xs font-medium uppercase opacity-70">Prediction</p>
        <p className="text-sm mt-1">
          Risk: <span className="font-medium">{insight.prediction.risk}</span>
        </p>
        <p className="text-sm mt-1">
          Timeframe: <span className="font-medium">{insight.prediction.timeframe}</span>
        </p>
      </div>

      {/* Explainability */}
      <div className="rounded-lg bg-(--surface-muted) p-3 space-y-2">
        <div className="flex items-center gap-1 text-xs font-medium uppercase opacity-70">
          <Info className="w-3 h-3" />
          Why this insight?
        </div>

        <p className="text-sm">{insight.explainability.reasoning}</p>

        {insight.explainability.triggered_signals.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {insight.explainability.triggered_signals.map((s, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Warning */}
      {insight.warning && (
        <div className="flex gap-2 text-sm text-(--accent-danger)">
          <AlertTriangle className="w-4 h-4 mt-0.5" />
          {insight.warning}
        </div>
      )}
    </div>
  );
}
