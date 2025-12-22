import api from "@/src/lib/api";
import { WeeklySummary, TrendSignals, PatternResponse } from "@/src/types/progress";

export const progressService = {
  getWeeklySummary: async () => {
    const res = await api.get<{ data: WeeklySummary }>("/progress/weekly-summary");
    return res.data.data;
  },

  getTrends: async () => {
    const res = await api.get<{ data: TrendSignals }>("/progress/trends");
    return res.data.data;
  },

  getPatterns: async () => {
    const res = await api.get<{ data: PatternResponse }>("/progress/patterns");
    return res.data.data;
  },
};
