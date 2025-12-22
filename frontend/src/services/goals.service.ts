import api from "@/src/lib/api";
import { UserGoals } from "@/src/types/goals";

export const goalsService = {
  /**
   * Fetch the current user's goals
   * GET /api/goals
   * Returns null if goals are not set yet
   */
  get: async (): Promise<UserGoals | null> => {
    const response = await api.get<{
      success: boolean;
      data: UserGoals | null;
    }>("/goals");

    return response.data.data;
  },

  /**
   * Create or update user goals
   * POST /api/goals
   */
  upsert: async (data: UserGoals): Promise<UserGoals> => {
    const response = await api.post<{
      success: boolean;
      data: UserGoals;
    }>("/goals", data);

    return response.data.data;
  },
};
