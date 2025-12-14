export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  userId: string;
}

export interface CreateMealData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date?: string;
}
