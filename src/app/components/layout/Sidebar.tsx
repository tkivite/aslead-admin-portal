"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Users,
  UserCog,
} from "lucide-react"

// Define role-based access permissions
const rolePermissions = {
  admin: [
    "dashboard",
    "students",
    "courses",
    "applications",
    "messaging",
    "users",
    "roles",
    "settings",
    "payments",
    "finance",
  ],
  finance: ["dashboard", "students", "payments", "finance"],
  instructor: ["dashboard", "students", "courses", "messaging"],
  staff: ["dashboard", "students", "courses", "applications", "messaging"],
}

type MenuItem = {
  name: string
  path: string
  icon: React.ElementType
  key: string
  submenu?: MenuItem[]
}

export default function Sidebar({ userRole = "admin" }: { userRole?: string }) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // Get permissions for the current user role
  const permissions = rolePermissions[userRole as keyof typeof rolePermissions] || []

  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/",
      icon: Home,
      key: "dashboard",
    },
    {
      name: "Students",
      path: "/students",
      icon: Users,
      key: "students",
    },
    {
      name: "Courses",
      path: "/courses",
      icon: BookOpen,
      key: "courses",
    },
    {
      name: "Applications",
      path: "/applications",
      icon: ClipboardList,
      key: "applications",
    },
    {
      name: "Messaging",
      path: "/messaging",
      icon: MessageSquare,
      key: "messaging",
    },
    {
      name: "User Management",
      path: "#",
      icon: UserCog,
      key: "user-management",
      submenu: [
        {
          name: "Users",
          path: "/users",
          icon: Users,
          key: "users",
        },
        {
          name: "Roles",
          path: "/roles",
          icon: UserCog,
          key: "roles",
        },
      ],
    },
    {
      name: "System",
      path: "#",
      icon: Settings,
      key: "system",
      submenu: [
        {
          name: "Settings",
          path: "/settings",
          icon: Settings,
          key: "settings",
        },
      ],
    },
    {
      name: "Finance",
      path: "#",
      icon: CreditCard,
      key: "finance-menu",
      submenu: [
        {
          name: "Payments",
          path: "/payments",
          icon: CreditCard,
          key: "payments",
        },
      
      ],
    },
    {
      name: "Reports",
      path: "/reports",
      icon: FileText,
      key: "reports",
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: Calendar,
      key: "calendar",
    },
  ]

  const toggleSubmenu = (key: string) => {
    if (openSubmenu === key) {
      setOpenSubmenu(null)
    } else {
      setOpenSubmenu(key)
    }
  }

  // Filter menu items based on user permissions
  const filteredMenuItems = menuItems.filter((item) => {
    // If it's a submenu, check if any of its items are permitted
    if (item.submenu) {
      const hasPermittedSubmenuItems = item.submenu.some((subItem) => permissions.includes(subItem.key))
      return hasPermittedSubmenuItems
    }
    // Otherwise check if the item itself is permitted
    return permissions.includes(item.key)
  })

  // Also filter submenu items
  const getFilteredSubmenu = (submenu: MenuItem[]) => {
    return submenu.filter((item) => permissions.includes(item.key))
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto flex-shrink-0">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
          <Image src="/favicon.png" alt="ASLEAD Logo" width={24} height={24} className="object-contain" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-gray-800">ASLEAD</h1>
          <p className="text-xs text-gray-500">Admin Portal</p>
        </div>
      </div>

      <nav className="p-4">
        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Main Menu</p>
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => (
            <li key={item.name}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.key)}
                    className={`flex items-center justify-between w-full p-2 rounded-lg text-left ${
                      openSubmenu === item.key
                        ? "bg-backgroundsecondary text-primary"
                        : "text-gray-700 hover:bg-backgroundsecondary"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openSubmenu === item.key ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openSubmenu === item.key && (
                    <ul className="mt-1 ml-6 space-y-1">
                      {getFilteredSubmenu(item.submenu).map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.path}
                            className={`flex items-center p-2 rounded-lg ${
                              pathname === subItem.path
                                ? "bg-primary text-white"
                                : "text-gray-700 hover:bg-backgroundsecondary"
                            }`}
                          >
                            <subItem.icon className="w-4 h-4 mr-3" />
                            <span>{subItem.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center p-2 rounded-lg ${
                    pathname === item.path ? "bg-primary text-white" : "text-gray-700 hover:bg-backgroundsecondary"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-backgroundsecondary rounded-lg p-3">
          <p className="text-sm font-medium text-gray-800">Logged in as:</p>
          <p className="text-xs text-gray-600 capitalize">{userRole} User</p>
        </div>
      </div>
    </aside>
  )
}
