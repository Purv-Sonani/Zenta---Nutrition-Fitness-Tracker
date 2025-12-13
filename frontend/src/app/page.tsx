"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "../components/ui/Loader";

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Returns a loading spinner while deciding
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Loader className="h-10 w-10 text-blue-600" />
    </div>
  );
}
