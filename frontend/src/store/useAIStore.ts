import { create } from "zustand";
import axios from "axios";
import { aiService } from "../services/ai.service";

// Define the shape of our data
interface Suggestion {
  category: string;
  item: string;
  reason: string;
}

interface BalanceResult {
  analysis: string;
  suggestions: Suggestion[];
}

interface AIState {
  // State
  isLoading: boolean;
  balanceResult: BalanceResult | null;
  error: string | null;

  // Actions
  analyzeMeal: (mealText: string) => Promise<void>;
  resetAI: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  isLoading: false,
  balanceResult: null,
  error: null,

  analyzeMeal: async (mealText: string) => {
    set({ isLoading: true, error: null, balanceResult: null });

    try {
      const data = await aiService.getBalancedMeal(mealText);

      set({ balanceResult: data, isLoading: false });
    } catch (err) {
      console.error("AI Store Error:", err);
      set({
        error: "AI is taking a nap. Please try again.",
        isLoading: false,
      });
    }
  },

  resetAI: () => set({ balanceResult: null, error: null, isLoading: false }),
}));
