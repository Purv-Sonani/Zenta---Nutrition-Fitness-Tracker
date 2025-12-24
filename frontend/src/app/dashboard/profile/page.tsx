"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { authService, UserProfile } from "@/src/services/auth.service";
import { Button, Loader } from "@/src/components/ui";

import { useGoalsStore } from "@/src/store/useGoalsStore";
import { useWorkoutStore } from "@/src/store/useWorkoutsStore";
import { useNutritionStore } from "@/src/store/useNutritionStore";
import { useProgressStore } from "@/src/store/useProgressStore";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setUser(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      useGoalsStore.getState().reset();
      useWorkoutStore.getState().reset();
      useNutritionStore.getState().reset();
      useProgressStore.getState().reset();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader className="h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-(--foreground)">My Profile</h1>

      <div className="bg-(--surface) p-8 rounded-2xl shadow-sm border border-(--border-subtle) flex flex-col items-center text-center">
        <div className="h-24 w-24 bg-(--surface-muted) rounded-full flex items-center justify-center text-primary mb-4">
          <FaUserCircle className="h-12 w-12" />
        </div>

        <h2 className="text-xl font-bold text-(--foreground)">{user.username}</h2>
        <p className="text-(--text-muted)">Member</p>

        <div className="w-full mt-8 space-y-4 text-left">
          <div className="p-4 bg-(--surface-muted) rounded-lg flex items-center gap-4">
            <FaEnvelope className="text-(--text-muted)" />
            <div>
              <p className="text-xs text-(--text-muted) uppercase font-semibold">Email Address</p>
              <p className="text-(--foreground) font-medium">{user.email}</p>
            </div>
          </div>

          <div className="p-4 bg-(--surface-muted) rounded-lg flex items-center gap-4">
            <FaCalendarAlt className="text-(--text-muted)" />
            <div>
              <p className="text-xs text-(--text-muted) uppercase font-semibold">Joined On</p>
              <p className="text-(--foreground) font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 w-full">
          <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300" onClick={handleLogout}>
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
