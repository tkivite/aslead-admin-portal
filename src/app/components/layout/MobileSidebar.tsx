"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ClipboardList,
  CreditCard,
  Home,
  Users,
  UserCog,
  Smartphone,
  X
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks";

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
  ],
  finance: ["dashboard", "students", "payments", "finance"],
  instructor: ["dashboard", "students", "courses", "messaging"],
  staff: ["dashboard", "students", "courses", "applications", "messaging"],
};

type MenuItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  key: string;
  submenu?: MenuItem[];
};

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

export default function MobileSidebar({ isOpen, onClose, userRole = "admin" }: MobileSidebarProps) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const user = useAppSelector((state) => state.user.value);

  // Get permissions for the current user role
  const permissions = rolePermissions[userRole as keyof typeof rolePermissions] || [];

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
      ],
    },
  ];

  const toggleSubmenu = (key: string) => {
    if (openSubmenu === key) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(key);
    }
  };

  // Filter menu items based on user permissions
  const filteredMenuItems = menuItems.filter((item) => {
    // If it's a submenu, check if any of its items are permitted
    if (item.submenu) {
      const hasPermittedSubmenuItems = item.submenu.some((subItem) => permissions.includes(subItem.key));
      return hasPermittedSubmenuItems;
    }
    // Otherwise check if the item itself is permitted
    return permissions.includes(item.key);
  });

  // Also filter submenu items
  const getFilteredSubmenu = (submenu: MenuItem[]) => {
    return submenu.filter((item) => permissions.includes(item.key));
  };

  const handleLinkClick = () => {
    onClose();
    setOpenSubmenu(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <h1 className="font-bold text-lg text-gray-800">ASLEAD</h1>
                  <p className="text-xs text-gray-500">Admin Portal</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-backgroundsecondary transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              <p className="text-xs font-semibold text-gray-500 mb-4 uppercase">Main Menu</p>
              <ul className="space-y-2">
                {filteredMenuItems.map((item) => (
                  <li key={item.name}>
                    {item.submenu ? (
                      <div>
                        <button
                          onClick={() => toggleSubmenu(item.key)}
                          className={`flex items-center justify-between w-full p-3 rounded-lg text-left ${
                            openSubmenu === item.key
                              ? "bg-backgroundsecondary text-primary"
                              : "text-gray-700 hover:bg-backgroundsecondary"
                          }`}
                        >
                          <div className="flex items-center">
                            <item.icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              openSubmenu === item.key ? "transform rotate-180" : ""
                            }`}
                          />
                        </button>
                        {openSubmenu === item.key && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 ml-6 space-y-1"
                          >
                            {getFilteredSubmenu(item.submenu).map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.path}
                                  onClick={handleLinkClick}
                                  className={`flex items-center p-3 rounded-lg ${
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
                          </motion.ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.path}
                        onClick={handleLinkClick}
                        className={`flex items-center p-3 rounded-lg ${
                          pathname === item.path ? "bg-primary text-white" : "text-gray-700 hover:bg-backgroundsecondary"
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Info */}
            <div className="p-4 mt-auto">
              <div className="bg-backgroundsecondary rounded-lg p-3">
                <p className="text-sm font-medium text-gray-800">Logged in as:</p>
                <p className="text-xs text-gray-600 capitalize">{userRole} {user?.username}</p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
