import api from "../lib/api";
import { AuthResponse } from "../types/auth";
import { z } from "zod";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

// --- Register Schema ---
export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// --- Login Schema ---
export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  // We don't strictly enforce min-length on login to avoid revealing rules to attackers,
  // but needs to ensure it's a string.
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const authService = {
  // Register User
  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  // Login User
  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  // Get Current User Profile (for session restoration)
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>("/auth/profile");
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
