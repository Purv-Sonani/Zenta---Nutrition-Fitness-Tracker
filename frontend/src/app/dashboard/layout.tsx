import React from "react";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { MobileHeader } from "@/src/components/layout/MobileHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar (Desktop) */}
      <Sidebar />

      {/* Header (Mobile) */}
      <MobileHeader />

      {/* Main Content Area */}
      {/* 'md:pl-64' pushes content to the right on desktop to make room for sidebar */}
      <main className="md:pl-64 min-h-screen transition-all duration-200 ease-in-out">
        <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
