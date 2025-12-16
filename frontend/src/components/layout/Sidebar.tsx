"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaDumbbell, FaAppleAlt, FaUser, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { authService } from "@/src/services/auth.service";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/src/store/useUiStore";
import { clsx } from "clsx";
import { Sparkles } from "lucide-react";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // Access store state
  const { isSidebarOpen, closeSidebar } = useUIStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/login");
      closeSidebar(); // Close sidebar on logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: FaHome },
    { name: "Workouts", href: "/dashboard/workouts", icon: FaDumbbell },
    { name: "Nutrition", href: "/dashboard/nutrition", icon: FaAppleAlt }, // Changed icon to Apple/Nutrition
    { name: "Profile", href: "/dashboard/profile", icon: FaUser },
    {
      name: "AI Balancer",
      href: "/dashboard/balancer",
      icon: Sparkles, // Uses the Lucide 'Sparkles' icon to denote AI
    },
  ];

  return (
    <>
      {/* 1. MOBILE OVERLAY (Dark background when menu is open) */}
      {isSidebarOpen && <div onClick={closeSidebar} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" />}

      {/* 2. SIDEBAR CONTAINER */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out",
          // Logic: On mobile, move it off-screen (-translate-x-full) unless open.
          // On Desktop (md), ALWAYS show it (translate-x-0).
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <span className="text-2xl font-bold text-primary tracking-tight">ZENTA</span>
          {/* Close Button (Mobile Only) */}
          <button onClick={closeSidebar} className="md:hidden text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeSidebar} // Close menu when link is clicked (Mobile UX)
                className={clsx("flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group", isActive ? "bg-blue-50 text-primary" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")}
              >
                <item.icon className={clsx("mr-3 h-5 w-5 transition-colors", isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <FaSignOutAlt className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
