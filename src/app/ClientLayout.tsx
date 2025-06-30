"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import "./globals.css";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import { useAppSelector } from "@/lib/hooks";
import { applicationsService } from "@/services/applications.api";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.user.value);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {

      await applicationsService.getPaginatedApplications(0, 10, "PENDING");
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        typeof (error as { status: number }).status === "number"
      ) {
        const typedError = error as { status: number };
        if (typedError.status === 401) {
          router.push("/login");
        }
      }

      console.error("Error fetching pending applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if we're on the login page
    const accessToken = localStorage.getItem("accessTokenSite");

    if (pathname === "/login") {
      setLoading(false);
      return;
    }

    if (!accessToken) {
      router.push("/login");
    }
  
    fetchApplications();
  }, []);

  return loading ? (
    <div className="flex items-center justify-center h-screen bg-backgroundsecondary">
      <div className="loader"></div>
    </div>
  ) : (

    <div className="flex h-screen bg-backgroundsecondary">
      {pathname !== "/login" && <Sidebar userRole={user?.role || "admin"} />}

      <div className="flex flex-col flex-1 overflow-hidden">
        {pathname !== "/login" && <Header />}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  
)
}
