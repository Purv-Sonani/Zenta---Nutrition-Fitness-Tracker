import { create } from "zustand";
import { WeeklySummary, TrendSignals, PatternResponse } from "@/src/types/progress";
import { progressService } from "@/src/services/progress.service";

interface ProgressState {
  weeklySummary: WeeklySummary | null;
  trends: TrendSignals | null;
  patterns: PatternResponse | null;

  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  fetchProgress: () => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  weeklySummary: null,
  trends: null,
  patterns: null,

  isLoading: false,
  error: null,
  isInitialized: false,

  fetchProgress: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true, error: null });

    try {
      const [weeklySummary, trends, patterns] = await Promise.all([progressService.getWeeklySummary(), progressService.getTrends(), progressService.getPatterns()]);

      set({
        weeklySummary,
        trends,
        patterns,
        isInitialized: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Failed to load progress data",
        isLoading: false,
      });
    }
  },
}));
