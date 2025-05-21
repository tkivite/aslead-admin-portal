"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "./components/layout/Sidebar"
import Header from "./components/layout/Header"

const inter = Inter({ subsets: ["latin"] })

interface User {
  email: string
  role: string
  name: string
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [user, setUser] = useState<User|null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if we're on the login page
    if (pathname === "/login") {
      setLoading(false)
      return
    }

    // Check for user in localStorage
    const storedUser = localStorage.getItem("user")

    if (!storedUser) {
      router.push("/login")
    } else {
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [pathname])

  // If we're on the login page or loading, just render children
  if (pathname === "/login" || loading) {
    return (
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    )
  }

  // If authenticated, render the app layout
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-backgroundsecondary">
          <Sidebar userRole={user?.role} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header user={user} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
