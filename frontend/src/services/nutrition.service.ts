import api from "@/src/lib/api";
import { Meal, CreateMealData } from "@/src/types/nutrition";

export const nutritionService = {
  getAll: async () => {
    const response = await api.get<any>("/meals");
    return response.data.data;
  },

  create: async (data: CreateMealData) => {
    const response = await api.post<any>("/meals", data);
    return response.data.data;
  },
};
