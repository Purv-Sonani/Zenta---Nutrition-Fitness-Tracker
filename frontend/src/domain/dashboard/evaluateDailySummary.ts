import { DashboardSummary, DashboardStatus } from "@/src/types/dashboard";

export function evaluateDailySummary(caloriesIn: number, caloriesOut: number, protein: number, duration: number): DashboardSummary {
  const net = caloriesIn - caloriesOut;

  // ---- Thresholds (v1, configurable later via goals)
  const MIN_CALORIES_LOGGED = 800;
  const MIN_PROTEIN = 80;
  const MIN_ACTIVITY_MINUTES = 10;

  let status: DashboardStatus = "onTrack";

  const caloriesOk = caloriesIn >= MIN_CALORIES_LOGGED;
  const proteinOk = protein >= MIN_PROTEIN;
  const activityOk = duration >= MIN_ACTIVITY_MINUTES;

  const signalsMet = [caloriesOk, proteinOk, activityOk].filter(Boolean).length;

  if (signalsMet <= 1) {
    status = "offTrack";
  } else if (signalsMet === 2) {
    status = "atRisk";
  } else {
    status = "onTrack";
  }

  return {
    caloriesIn,
    caloriesOut,
    protein,
    duration,
    net,
    status,
  };
}
