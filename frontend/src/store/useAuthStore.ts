import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "../types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  // Actions
  setAuth: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (user) => set({ user, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // (optional) explicitly use localStorage
    }
  )
);
