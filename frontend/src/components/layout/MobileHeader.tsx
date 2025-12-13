"use client";

import { FaBars } from "react-icons/fa";

export function MobileHeader() {
  return (
    <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-40">
      <span className="text-xl font-bold text-primary">ZENTA</span>
      <button className="p-2 text-gray-600 rounded-md hover:bg-gray-100">
        <FaBars className="h-6 w-6" />
      </button>
    </header>
  );
}
