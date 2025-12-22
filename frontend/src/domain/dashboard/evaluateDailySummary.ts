import { DashboardSummary, DashboardStatus } from "@/src/types/dashboard";

export function evaluateDailySummary(caloriesIn: number, caloriesOut: number, protein: number, duration: number): DashboardSummary {
  const net = caloriesIn - caloriesOut;

  let status: DashboardStatus = "onTrack";
  if (net > 500) status = "offTrack";
  else if (net > 200) status = "atRisk";

  return {
    caloriesIn,
    caloriesOut,
    protein,
    duration,
    net,
    status,
  };
}
