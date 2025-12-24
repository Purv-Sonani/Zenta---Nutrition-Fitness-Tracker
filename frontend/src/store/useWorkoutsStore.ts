import { create } from "zustand";
import { Workout } from "@/src/types/workout";
import { workoutService } from "@/src/services/workout.service";

interface WorkoutState {
  workouts: Workout[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // Tracks if we have fetched at least once

  // Actions
  fetchWorkouts: () => Promise<void>;
  addWorkout: (workout: Workout) => void;

  reset: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],
  isLoading: false,
  error: null,
  isInitialized: false,

  fetchWorkouts: async () => {
    // OPTIMIZATION: If we already have data, don't fetch again automatically
    // (You can remove this if you want 'always fresh' data, but this solves your specific issue)
    if (get().isInitialized) return;

    set({ isLoading: true, error: null });
    try {
      const data = await workoutService.getAll();
      set({ workouts: data || [], isInitialized: true, isLoading: false });
    } catch (error: any) {
      set({ error: "Failed to fetch workouts", isLoading: false });
    }
  },

  addWorkout: (workout) => {
    set((state) => ({
      workouts: [workout, ...state.workouts], // Add new workout to top of list
    }));
  },
  reset: () => {
    set({
      workouts: [],
      isLoading: false,
      error: null,
      isInitialized: false,
    });
  },
}));
