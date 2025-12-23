export interface WeeklySummary {
  caloriesAdherencePercent: number;
  proteinConsistencyDays: number;
  workoutAdherencePercent: number;
}

export type TrendStatus = "improving" | "declining" | "stable";

export interface TrendSignals {
  caloriesTrend: TrendStatus;
  proteinTrend: TrendStatus;
  workoutTrend: TrendStatus;
}

export type PatternInsightType = "protein" | "workout";

export interface PatternInsight {
  type: PatternInsightType;
  title: string;
  description: string;
}

export interface PatternResponse {
  insights: PatternInsight[];
}

export type TrendDirection = "improving" | "declining" | "stable";
