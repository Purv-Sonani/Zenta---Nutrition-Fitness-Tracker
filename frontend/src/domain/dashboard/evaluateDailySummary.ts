import { DashboardSummary, DashboardStatus } from "@/src/types/dashboard";

import { UserGoals } from "@/src/types/goals";

export function evaluateDailySummary(caloriesIn: number, caloriesOut: number, protein: number, duration: number, goals: UserGoals | null): DashboardSummary {
  const net = caloriesIn - caloriesOut;
  const hour = new Date().getHours();
  const isLateDay = hour >= 18;

  if (!goals) {
    return {
      caloriesIn,
      caloriesOut,
      protein,
      duration,
      net,
      status: "atRisk",
    };
  }

  const caloriesRatio = caloriesIn / goals.dailyCaloriesTarget;
  const proteinRatio = protein / goals.dailyProteinTarget;

  const caloriesOk = caloriesRatio >= (isLateDay ? 0.8 : 0.4);
  const proteinOk = proteinRatio >= (isLateDay ? 1.0 : 0.6);
  const activityOk = duration > 0;

  const signalsMet = [caloriesOk, proteinOk, activityOk].filter(Boolean).length;

  let status: DashboardStatus;
  if (signalsMet === 3) status = "onTrack";
  else if (signalsMet === 2) status = "atRisk";
  else status = "offTrack";

  return {
    caloriesIn,
    caloriesOut,
    protein,
    duration,
    net,
    status,
  };
}
