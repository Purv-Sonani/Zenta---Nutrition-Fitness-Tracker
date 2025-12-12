"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService, registerSchema } from "../../../services/auth.service";
import { z } from "zod";
import { useAuthStore } from "../../../store/useAuthStore"; // <--- The essential import

export default function RegisterPage() {
  const router = useRouter();
  // Action from the Zustand store
  const setAuth = useAuthStore((state) => state.setAuth);

  // State for form fields
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // State for UI feedback
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear specific error when user starts typing again
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    // Clear general error when user interacts with form
    setGeneralError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError("");

    try {
      // 1. Frontend Validation (Zod)
      const validData = registerSchema.parse(formData);

      // 2. API Call (Backend sets the HTTP-only cookie)
      const response = await authService.register(validData);

      // 3. Update Global Store (UI now knows we are logged in)
      if (response.data) {
        setAuth(response.data);
      }

      // 4. Success -> Redirect to Dashboard
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors (e.g., password too short)
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        // Handle API errors (e.g., "User already exists", server down)
        const apiError = error as any;
        // Fallback to a generic error message if the backend message is unavailable
        const message = apiError.response?.data?.message || "A network error occurred or the server is unavailable.";
        setGeneralError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create an account</h2>
          <p className="mt-2 text-sm text-gray-600">Start tracking your fitness journey today</p>
        </div>

        {/* General Error Display (for backend errors like "User already exists") */}
        {generalError && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">{generalError}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${errors.username ? "border-red-500" : "border-gray-300"}`}
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${errors.email ? "border-red-500" : "border-gray-300"}`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`relative block w-full appearance-none rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${errors.password ? "border-red-500" : "border-gray-300"}`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
