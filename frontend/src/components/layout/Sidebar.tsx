"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/src/store/useAuthStore";
import { FaHome, FaDumbbell, FaAppleAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import { authService } from "@/src/services/auth.service";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: FaHome },
  { name: "Workouts", href: "/dashboard/workouts", icon: FaDumbbell },
  { name: "Nutrition", href: "/dashboard/nutrition", icon: FaAppleAlt },
  { name: "Profile", href: "/dashboard/profile", icon: FaUser },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await authService.logout();
    logout();
    router.push("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      {/* Logo Area */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary tracking-tighter">ZENTA</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
              <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-primary" : "text-gray-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout Area */}
      <div className="p-4 border-t border-gray-200">
        <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors">
          <FaSignOutAlt className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
