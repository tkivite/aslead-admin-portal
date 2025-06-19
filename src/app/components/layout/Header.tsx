"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { /* Bell ,*/ LogOut, /*  Settings, */ Trash2, User, X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { deleteUser } from "@/lib/features/userSlice"



// Mock notifications data
const initialNotifications = [
  { id: "1", title: "New student registration", time: "2 minutes ago" },
  { id: "2", title: "Payment received", time: "1 hour ago" },
  { id: "3", title: "System update completed", time: "Yesterday" },
]

export default function Header() {
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const [notifications, setNotifications] = useState(initialNotifications)
  const router = useRouter()

  const profileRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const user = useAppSelector((state) => state.user.value)
  const dispatch = useAppDispatch()



  // Handle profile navigation
/*   const handleProfileNavigation = (path: string) => {
    setShowProfile(false)
    router.push(path)
  } */

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("accessTokenSite")
    localStorage.removeItem("refreshTokenSite")
    dispatch(deleteUser())
    router.push("/login")
  }

  // Handle notification click
  const handleNotificationClick = (notificationId: string) => {
    alert(`Notification ${notificationId} clicked`)
    // In a real application, this would mark the notification as read and navigate
  }

  // Clear a single notification
  const clearNotification = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation() // Prevent triggering the notification click
    setNotifications(notifications.filter((notification) => notification.id !== notificationId))
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // View all notifications
  const viewAllNotifications = () => {
    setShowNotifications(false)
    router.push("/notifications")
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-end">
     

      <div className="flex items-center space-x-4">
        <div className="relative" ref={notificationRef}>
         {/*  <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-backgroundsecondary transition-colors"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            )}
          </button> */}

          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10"
            >
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold">Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Clear all
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-3 hover:bg-backgroundsecondary border-b border-gray-100 cursor-pointer relative group"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <p className="text-sm font-medium pr-6">{notification.title}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                      <button
                        onClick={(e) => clearNotification(e, notification.id)}
                        className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <p>No notifications</p>
                  </div>
                )}
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button onClick={viewAllNotifications} className="text-sm text-tertiary hover:underline">
                  View all notifications
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-backgroundsecondary transition-colors"
          >
            <div className="w-8 h-8 bg-tertiary rounded-full flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <span className="font-medium">{user?.username || "Admin User"}</span>
          </button>

          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10"
            >
              {/* <button
                onClick={() => handleProfileNavigation("/profile")}
                className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-backgroundsecondary"
              >
                <User size={16} className="mr-2" />
                Your Profile
              </button>
              <button
                onClick={() => handleProfileNavigation("/account")}
                className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-backgroundsecondary"
              >
                <Settings size={16} className="mr-2" />
                Account Settings
              </button> */}
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-backgroundsecondary"
              >
                <LogOut size={16} className="mr-2" />
                Sign out
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  )
}
