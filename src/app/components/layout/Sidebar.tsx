"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
/*   BookOpen,
  Calendar, */
  ChevronDown,
  ClipboardList,
  CreditCard,
/*   FileText, */
  Home,
 /*  MessageSquare,
  Settings, */
  Users,
  UserCog,
  Smartphone,
  BookOpen,
  MapPin
} from "lucide-react"
import { useAppSelector } from "@/lib/hooks"

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
    "pending-applications",
    "enrolled-students",
    "exited-students",
    "all-payments",
    "mpesa-payments",
    "student-statements",
    "programs",
    "campuses",
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

interface SidebarProps {
  userRole?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ userRole = "admin", isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [hasBeenExpandedByHover, setHasBeenExpandedByHover] = useState(false)
  const user = useAppSelector((state) => state.user.value)

  // Show expanded state when not collapsed, or when hovered, or when previously expanded by hover
  const isExpanded = !isCollapsed || isHovered || hasBeenExpandedByHover

  // Reset hover expansion when sidebar is manually collapsed
  useEffect(() => {
    if (!isCollapsed) {
      setHasBeenExpandedByHover(false)
    }
  }, [isCollapsed])

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
    path: "#",
    icon: Users,
    key: "students",
    submenu: [
      {
        name: "Pending Applications",
        path: "/students/pending-applications",
        icon: ClipboardList,
        key: "pending-applications",
      },
      {
        name: "Enrolled Students",
        path: "/students/enrolled-students",
        icon: Users,
        key: "enrolled-students",
      },
      {
        name: "Exited Students",
        path: "/students/exited-students",
        icon: UserCog,
        key: "exited-students",
      },
    ],
  },
  {
    name: "Programs",
    path: "/programs",
    icon: BookOpen,
    key: "programs",
  },
  {
    name: "Campuses",
    path: "/campuses",
    icon: MapPin,
    key: "campuses",
  },
 /*  {
    name: "Courses",
    path: "/courses",
    icon: BookOpen,
    key: "courses",
  },

  {
    name: "Messaging",
    path: "/messaging",
    icon: MessageSquare,
    key: "messaging",
  }, */
  {
    name: "Finance",
    path: "#",
    icon: CreditCard,
    key: "finance",
    submenu: [
      {
        name: "All Payments",
        path: "/finance/all-payments",
        icon: CreditCard,
        key: "all-payments",
      },
      {
        name: "MPESA Payments",
        path: "/finance/mpesa-payments",
        icon: Smartphone,
        key: "mpesa-payments",
      },
    /*   {
        name: "Student Statements",
        path: "/finance/student-statements",
        icon: FileText,
        key: "student-statements",
      }, */
    ],
  },
  /* {
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
  }, */
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
    <motion.aside 
      className={`bg-white border-r border-gray-200 h-screen overflow-y-auto flex-shrink-0 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => {
        setIsHovered(true)
        if (isCollapsed) {
          setHasBeenExpandedByHover(true)
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ width: isExpanded ? 256 : 64 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <Image src="/favicon.png" alt="ASLEAD Logo" width={24} height={24} className="object-contain" />
          </div>
          <motion.div
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <h1 className="font-bold text-lg text-gray-800 whitespace-nowrap">ASLEAD</h1>
            <p className="text-xs text-gray-500 whitespace-nowrap">Admin Portal</p>
          </motion.div>
        </div>
        
        {/* Collapse Button - Only show when expanded */}
        {isExpanded && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:inline-flex items-center justify-center p-2 rounded-md bg-white/5 text-gray-600 hover:bg-white/10"
            aria-label="Collapse sidebar"
          >
            «
          </button>
        )}
      </div>

      <nav className="p-4">
        <motion.p 
          className="text-xs font-semibold text-gray-500 mb-2 uppercase"
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          Main Menu
        </motion.p>
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => (
            <li key={item.name}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => isExpanded && toggleSubmenu(item.key)}
                    className={`flex items-center justify-between w-full p-2 rounded-lg text-left ${
                      openSubmenu === item.key
                        ? "bg-backgroundsecondary text-primary"
                        : "text-gray-700 hover:bg-backgroundsecondary"
                    }`}
                    title={!isExpanded ? item.name : undefined}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <motion.span
                        animate={{ opacity: isExpanded ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    </div>
                    <motion.div
                      animate={{ opacity: isExpanded ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openSubmenu === item.key ? "transform rotate-180" : ""
                        }`}
                      />
                    </motion.div>
                  </button>
                  {openSubmenu === item.key && isExpanded && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 ml-6 space-y-1"
                    >
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
                            <subItem.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                            <span className="whitespace-nowrap">{subItem.name}</span>
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center p-2 rounded-lg ${
                    pathname === item.path ? "bg-primary text-white" : "text-gray-700 hover:bg-backgroundsecondary"
                  }`}
                  title={!isExpanded ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <motion.span
                    animate={{ opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 mt-auto">
        <motion.div 
          className="bg-backgroundsecondary rounded-lg p-3"
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm font-medium text-gray-800 whitespace-nowrap">Logged in as:</p>
          <p className="text-xs text-gray-600 capitalize whitespace-nowrap">{userRole} {user?.username}</p>
        </motion.div>
      </div>
    </motion.aside>
  )
}
