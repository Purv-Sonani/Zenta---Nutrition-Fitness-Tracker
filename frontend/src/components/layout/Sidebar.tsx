"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaDumbbell, FaAppleAlt, FaUser, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import clsx from "clsx";

import { authService } from "@/src/services/auth.service";
import { useUIStore } from "@/src/store/useUiStore";

import { useGoalsStore } from "@/src/store/useGoalsStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useWorkoutStore } from "@/src/store/useWorkoutsStore";
import { useNutritionStore } from "@/src/store/useNutritionStore";
import { useProgressStore } from "@/src/store/useProgressStore";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: FaHome },
  { name: "Workouts", href: "/dashboard/workouts", icon: FaDumbbell },
  { name: "Nutrition", href: "/dashboard/nutrition", icon: FaAppleAlt },
  { name: "AI Meal Balancer", href: "/dashboard/balancer", icon: Sparkles },
  { name: "Profile", href: "/dashboard/profile", icon: FaUser },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarOpen, closeSidebar } = useUIStore();

  const handleLogout = async () => {
    await authService.logout();

    closeSidebar();
    router.push("/login");

    // Reset All Store
    useAuthStore.getState().logout();
    useWorkoutStore.getState().reset();
    useNutritionStore.getState().reset();
    useGoalsStore.getState().reset();
    useProgressStore.getState().reset();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && <div onClick={closeSidebar} className="fixed inset-0 z-40 bg-black/40 md:hidden" />}

      {/* Sidebar */}
      <aside className={clsx("fixed inset-y-0 left-0 z-50 w-64 bg-(--surface) border-r border-(--border-subtle) transition-transform duration-300", isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0")}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-(--border-subtle)">
          <span className="text-xl font-bold text-primary">ZENTA</span>
          <button onClick={closeSidebar} className="md:hidden opacity-70 hover:opacity-100">
            <FaTimes />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.name} href={item.href} onClick={closeSidebar} className={clsx("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition", isActive ? "bg-primary/10 text-primary" : "opacity-70 hover:opacity-100 hover:bg-primary/5")}>
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-(--border-subtle)">
          <button onClick={handleLogout} className="flex items-center w-full gap-3 px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-500/10">
            <FaSignOutAlt className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
