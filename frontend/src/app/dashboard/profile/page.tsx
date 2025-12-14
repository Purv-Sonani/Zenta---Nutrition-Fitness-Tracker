"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { authService, UserProfile } from "@/src/services/auth.service";
import { Button, Loader } from "@/src/components/ui";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setUser(data);
      } catch (error) {
        console.error("Failed to load profile", error);
        // If fetch fails, they might not be logged in. Redirect logic could go here.
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/login"); // Redirect to login page
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
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-4">
          <FaUserCircle className="h-12 w-12" />
        </div>

        <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
        <p className="text-gray-500">Member</p>

        <div className="w-full mt-8 space-y-4 text-left">
          <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4">
            <FaEnvelope className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Email Address</p>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4">
            <FaCalendarAlt className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Joined On</p>
              <p className="text-gray-900 font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
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
