"use client";

import { Menu } from "lucide-react";
import Image from "next/image";

interface MobileNavbarProps {
  onMenuToggle: () => void;
}

export default function MobileNavbar({ onMenuToggle }: MobileNavbarProps) {
  return (
    <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* ASLEAD Logo */}
      <div className="flex items-center">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
          <Image src="/favicon.png" alt="ASLEAD Logo" width={20} height={20} className="object-contain" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-gray-800">ASLEAD</h1>
          <p className="text-xs text-gray-500">Admin Portal</p>
        </div>
      </div>

      {/* Hamburger Menu Button */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg hover:bg-backgroundsecondary transition-colors"
        aria-label="Toggle mobile menu"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>
    </header>
  );
}
