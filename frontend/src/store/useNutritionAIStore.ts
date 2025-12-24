import { create } from "zustand";
import { aiService } from "@/src/services/ai.service";
import { NutritionInsight } from "../types/ai/nutritionInsights";

interface NutritionAIState {
  insight: NutritionInsight | null;
  isLoading: boolean;
  error: string | null;

  fetchInsight: () => Promise<void>;
  reset: () => void;
}

export const useNutritionAIStore = create<NutritionAIState>((set) => ({
  insight: null,
  isLoading: false,
  error: null,

  fetchInsight: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await aiService.getNutritionInsight();
      set({ insight: data, isLoading: false });
    } catch (err) {
      set({
        error: "Failed to analyze nutrition patterns",
        isLoading: false,
      });
    }
  },

  reset: () => set({ insight: null, isLoading: false, error: null }),
}));
