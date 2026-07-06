import { create } from "zustand";
import { WeeklySummary, TrendSignals, PatternResponse } from "@/src/types/progress";
import { progressService } from "@/src/services/progress.service";
import { useDemoStore } from "./useDemoStore";
import { DEMO_WEEKLY_SUMMARY, DEMO_TRENDS, DEMO_PATTERNS } from "@/src/lib/demoData";

interface ProgressState {
  weeklySummary: WeeklySummary | null;
  trends: TrendSignals | null;
  patterns: PatternResponse | null;

  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  fetchProgress: () => Promise<void>;

  reset: () => void;
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

    // Demo mode: load mock progress
    if (useDemoStore.getState().isDemo) {
      set({
        weeklySummary: DEMO_WEEKLY_SUMMARY,
        trends: DEMO_TRENDS,
        patterns: DEMO_PATTERNS,
        isInitialized: true,
        isLoading: false,
      });
      return;
    }

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

  reset: () => {
    set({
      weeklySummary: null,
      trends: null,
      patterns: null,

      isLoading: false,
      error: null,
      isInitialized: false,
    });
  },
}));
