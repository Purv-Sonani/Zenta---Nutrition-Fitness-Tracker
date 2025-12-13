"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useAuthStore } from "../../../store/useAuthStore";
import { authService, loginSchema } from "../../../services/auth.service";
import { Input, Button } from "@/src/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const registeredSuccess = searchParams.get("registered");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setGeneralError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError("");

    try {
      const validData = loginSchema.parse(formData);
      const response = await authService.login(validData);

      if (response.data) {
        setAuth(response.data);
      }
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
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
          <p className="mt-2 text-sm text-gray-600">Sign in to your Zenta account</p>
        </div>

        {registeredSuccess && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200">Account created! You can now sign in.</div>}

        {generalError && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">{generalError}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input id="email" name="email" label="Email Address" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} error={errors.email} />
            <Input id="password" name="password" label="Password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} error={errors.password} />
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-500">Don&apos;t have an account? </span>
            <Link href="/register" className="font-medium text-primary hover:text-primary-hover">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
