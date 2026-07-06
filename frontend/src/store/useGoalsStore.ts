import { create } from "zustand";
import { goalsService } from "@/src/services/goals.service";
import { UserGoals } from "@/src/types/goals";
import { useDemoStore } from "./useDemoStore";
import { DEMO_GOALS } from "@/src/lib/demoData";

type GoalsStatus = "idle" | "loading" | "ready";

interface GoalsState {
  goals: UserGoals | null;
  status: GoalsStatus;
  error: string | null;

  fetchGoals: () => Promise<void>;
  upsertGoals: (data: UserGoals) => Promise<void>;
  reset: () => void;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: null,
  status: "idle",
  error: null,

  fetchGoals: async () => {
    if (get().status !== "idle") return; // only once

    // Demo mode: load mock goals
    if (useDemoStore.getState().isDemo) {
      set({ goals: DEMO_GOALS, status: "ready", error: null });
      return;
    }

    set({ status: "loading", error: null });

    try {
      const data = await goalsService.get();

      set({
        goals: data,
        status: "ready",
      });
    } catch (err) {
      set({
        goals: null,
        status: "ready", // IMPORTANT: still ready
        error: "Failed to fetch goals",
      });
    }
  },

  upsertGoals: async (data: UserGoals) => {
    set({ status: "loading", error: null });

    try {
      const updated = await goalsService.upsert(data);
      set({
        goals: updated,
        status: "ready",
      });
    } catch (err) {
      set({
        status: "ready",
        error: "Failed to update goals",
      });
      throw err;
    }
  },

  reset: () => {
    set({
      goals: null,
      status: "idle",
      error: null,
    });
  },
}));
