export type DashboardStatus = "onTrack" | "atRisk" | "offTrack";

export interface DashboardSummary {
  caloriesIn: number;
  caloriesOut: number;
  protein: number;
  duration: number;
  net: number;
  status: DashboardStatus;
}
