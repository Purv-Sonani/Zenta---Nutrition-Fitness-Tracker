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

export interface PatternResponse {
  warnings: string[];
}
