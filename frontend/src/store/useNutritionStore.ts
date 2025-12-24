import { create } from "zustand";
import { Meal } from "@/src/types/nutrition";
import { nutritionService } from "@/src/services/nutrition.service";

interface NutritionState {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  fetchMeals: () => Promise<void>;
  addMeal: (meal: Meal) => void;

  reset: () => void;
}

export const useNutritionStore = create<NutritionState>((set, get) => ({
  meals: [],
  isLoading: false,
  error: null,
  isInitialized: false,

  fetchMeals: async () => {
    if (get().isInitialized) return; // Cache hit

    set({ isLoading: true, error: null });
    try {
      const data = await nutritionService.getAll();
      set({ meals: data || [], isInitialized: true, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch meals", isLoading: false });
    }
  },

  addMeal: (meal) => {
    set((state) => ({
      meals: [meal, ...state.meals],
    }));
  },

  reset: () => {
    set({
      meals: [],
      isLoading: false,
      error: null,
      isInitialized: false,
    });
  },
}));
