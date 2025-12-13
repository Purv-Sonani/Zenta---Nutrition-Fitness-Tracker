export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface Workout {
  id: string;
  activity: string; // e.g., "Leg Day"
  duration: number; // in minutes
  caloriesBurned?: number;
  date: string; // ISO Date string
  exercises?: Exercise[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutData {
  activity: string;
  duration: number;
  caloriesBurned?: number;
  date?: string;
  exercises?: Omit<Exercise, "id">[];
}
