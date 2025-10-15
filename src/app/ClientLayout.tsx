"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import "./globals.css";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import MobileNavbar from "./components/layout/MobileNavbar";
import MobileSidebar from "./components/layout/MobileSidebar";
import AuthGuard from "./components/common/AuthGuard";
import { useAppSelector } from "@/lib/hooks";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.user.value);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // If on login page, render without auth guard
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // For all other pages, wrap with AuthGuard
  return (
    <AuthGuard>
      <div className="flex h-screen bg-backgroundsecondary">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar 
            userRole={user?.role || "admin"} 
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Desktop Header */}
          <div className="hidden md:block">
            <Header 
              isSidebarCollapsed={isSidebarCollapsed}
              onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </div>

          {/* Mobile Navbar */}
          <div className="md:hidden">
            <MobileNavbar onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          userRole={user?.role || "admin"}
        />
      </div>
    </AuthGuard>
  );
}
