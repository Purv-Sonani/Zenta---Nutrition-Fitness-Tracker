import api from "@/src/lib/api";
import { Workout, CreateWorkoutData } from "@/src/types/workout";

export const workoutService = {
  // Get all workouts
  getAll: async () => {
    // We explicitly tell Axios "we don't know the exact shape yet (any)"
    // to prevent it from confusing TypeScript.
    const response = await api.get<any>("/workouts");

    // Backend sends: { success: true, count: 0, data: [ ...workouts ] }
    // just return the array.
    return response.data.data;
  },

  getOne: async (id: string) => {
    const response = await api.get<any>(`/workouts/${id}`);
    return response.data.data;
  },

  create: async (data: CreateWorkoutData) => {
    const response = await api.post<any>("/workouts", data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<any>(`/workouts/${id}`);
    return response.data;
  },
};
