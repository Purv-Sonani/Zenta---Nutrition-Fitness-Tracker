import api from "@/src/lib/api";
import { NutritionInsight } from "../types/ai/nutritionInsights";

export const aiService = {
  getBalancedMeal: async (mealText: String) => {
    const response = await api.post<any>("/ai/balance", { mealText });
    return response.data;
  },

  getNutritionInsight: async (): Promise<NutritionInsight> => {
    const res = await api.get("/ai/nutrition-insight");
    return res.data.data;
  },
};
