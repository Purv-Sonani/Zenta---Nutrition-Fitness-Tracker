import { create } from "zustand";
import { goalsService } from "@/src/services/goals.service";
import { UserGoals } from "@/src/types/goals";

interface GoalsState {
  goals: UserGoals | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  fetchGoals: () => Promise<void>;
  upsertGoals: (data: UserGoals) => Promise<void>;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  fetchGoals: async () => {
    if (get().isInitialized) return; // cache hit

    set({ isLoading: true, error: null });

    try {
      const data = await goalsService.get();
      set({
        goals: data,
        isInitialized: true,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: "Failed to fetch goals",
        isLoading: false,
      });
    }
  },

  upsertGoals: async (data: UserGoals) => {
    set({ isLoading: true, error: null });

    try {
      const updated = await goalsService.upsert(data);
      set({
        goals: updated,
        isInitialized: true,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: "Failed to update goals",
        isLoading: false,
      });
      throw err;
    }
  },
}));
