"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import { useAppSelector } from "@/lib/hooks";

const inter = Inter({ subsets: ["latin"] });


export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.user.value);

  useEffect(() => {
    // Check if we're on the login page
    const accessToken = localStorage.getItem("accessTokenSite");
  
    if (pathname === "/login" ) {
      setLoading(false);
      return;
    }

    if (!accessToken ) {
   
      router.push("/login");
    }

    setLoading(false);
  }, [pathname, user]);

  // If we're on the login page or loading, just render children
  if (pathname === "/login" || loading) {
    return (
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    );
  }

  // If authenticated, render the app layout
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-backgroundsecondary">
        <Sidebar userRole={user?.role || "admin"} />

          <div className="flex flex-col flex-1 overflow-hidden">
            <Header  />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
