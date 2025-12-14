"use client";

import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { useUIStore } from "@/src/store/useUiStore";

export function MobileHeader() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 md:hidden">
      <div className="flex items-center gap-3">
        {/* 👇 This button now works! */}
        <button onClick={toggleSidebar} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md" aria-label="Toggle Menu">
          <FaBars className="w-5 h-5" />
        </button>

        <Link href="/dashboard" className="font-bold text-xl text-primary tracking-tight">
          ZENTA
        </Link>
      </div>

      {/* Optional: You can put a user avatar here later if you want */}
      <div className="w-8 h-8" />
    </header>
  );
}
