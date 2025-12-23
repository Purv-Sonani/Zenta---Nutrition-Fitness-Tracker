"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { MobileHeader } from "@/src/components/layout/MobileHeader";
import { useGoalsStore } from "@/src/store/useGoalsStore";
import { Loader } from "@/src/components/ui";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { goals, fetchGoals, isInitialized, isLoading } = useGoalsStore();

  useEffect(() => {
    if (!isInitialized) {
      fetchGoals();
    }
  }, [fetchGoals, isInitialized]);

  // ⛔ Block all dashboard pages except goal setup
  useEffect(() => {
    if (isInitialized && !isLoading && !goals && !pathname.startsWith("/dashboard/goals/setup")) {
      router.replace("/dashboard/goals/setup");
    }
  }, [isInitialized, isLoading, goals, pathname, router]);

  // ⏳ Prevent flicker while checking goals
  if (!isInitialized || isLoading || (!goals && !pathname.startsWith("/dashboard/goals/setup"))) {
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

      <main className="md:pl-64 min-h-screen transition-all">
        <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
