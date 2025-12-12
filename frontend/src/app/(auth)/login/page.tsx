"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService, loginSchema } from "../../../services/auth.service";
import { z } from "zod";
import { useAuthStore } from "../../../store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Check if user was redirected here after registration
  const registeredSuccess = searchParams.get("registered");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setGeneralError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError("");

    try {
      // 1. Validate Input
      const validData = loginSchema.parse(formData);

      // 2. Call API
      const response = await authService.login(validData);

      // 3. Update Global Store
      if (response.data) {
        setAuth(response.data);
      }

      // 4. Redirect to Dashboard
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        const apiError = error as any;
        const message = apiError.response?.data?.message || "Invalid email or password";
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
        </div>

        {/* Success Message if redirected from Register */}
        {registeredSuccess && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200">Account created successfully! Please sign in.</div>}

        {/* Error Message */}
        {generalError && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">{generalError}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
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

            {/* Password */}
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
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-500">Don&apos;t have an account? </span>
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
