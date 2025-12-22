import React from "react";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { MobileHeader } from "@/src/components/layout/MobileHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Sidebar (Desktop) */}
      <Sidebar />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Content */}
      <main className="md:pl-64 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
