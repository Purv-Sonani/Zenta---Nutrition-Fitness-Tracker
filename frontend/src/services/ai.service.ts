import api from "@/src/lib/api";

export const aiService = {
  getBalancedMeal: async (mealText: String) => {
    const response = await api.post<any>("/ai/balance", { mealText });
    return response.data;
  },
};
