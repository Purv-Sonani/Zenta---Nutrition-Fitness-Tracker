"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { MobileHeader } from "@/src/components/layout/MobileHeader";
import { Loader } from "@/src/components/ui";
import { useGoalsStore } from "@/src/store/useGoalsStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { goals, status, fetchGoals } = useGoalsStore();

  // Always try once
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Redirect only when READY
  useEffect(() => {
    if (status !== "ready") return;

    if (!goals && !pathname.startsWith("/dashboard/goals/setup")) {
      router.replace("/dashboard/goals/setup");
    }

    if (goals && pathname.startsWith("/dashboard/goals/setup")) {
      router.replace("/dashboard");
    }
  }, [status, goals, pathname, router]);

  if (status !== "ready") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--background)">
      <Sidebar />
      <MobileHeader />
      <main className="md:pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
