"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import { authService } from "../../services/auth.service";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Protect the route: If not logged in, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await authService.logout(); // Call backend to clear cookie
      logout(); // Clear frontend store
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Prevent flash of content while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.username}!</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm">
            Sign Out
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Activity</h3>
            <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No workouts logged yet.</p>
              <button className="mt-4 text-blue-600 font-medium hover:underline">+ Log Workout</button>
            </div>
          </div>

          {/* Nutrition Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Nutrition</h3>
            <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No meals logged yet.</p>
              <button className="mt-4 text-green-600 font-medium hover:underline">+ Log Meal</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
