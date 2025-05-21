"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Calendar, Check, Filter, Search, Trash2, X } from "lucide-react"
import { motion } from "framer-motion"

// Mock notifications data
const initialNotifications = [
  {
    id: "1",
    title: "New student registration",
    description: "A new student has registered for the Advanced Leadership course.",
    time: "2 minutes ago",
    type: "registration",
    read: false,
  },
  {
    id: "2",
    title: "Payment received",
    description: "Payment of Ksh.1,200 has been received from John Doe for the Executive Leadership program.",
    time: "1 hour ago",
    type: "payment",
    read: false,
  },
  {
    id: "3",
    title: "System update completed",
    description: "The system has been updated to version 2.4.0. New features include improved reporting and analytics.",
    time: "Yesterday",
    type: "system",
    read: true,
  },
  {
    id: "4",
    title: "New application submitted",
    description: "Sarah Johnson has submitted an application for the Strategic Leadership program.",
    time: "2 days ago",
    type: "application",
    read: true,
  },
  {
    id: "5",
    title: "Course enrollment deadline approaching",
    description: "The enrollment deadline for the Fall Leadership Bootcamp is in 3 days.",
    time: "3 days ago",
    type: "course",
    read: true,
  },
  {
    id: "6",
    title: "New message from instructor",
    description: "Dr. Michael Brown has sent a message regarding the upcoming Leadership Summit.",
    time: "1 week ago",
    type: "message",
    read: true,
  },
  {
    id: "7",
    title: "Account settings updated",
    description: "Your account settings have been updated successfully.",
    time: "1 week ago",
    type: "account",
    read: true,
  },
  {
    id: "8",
    title: "New role assigned",
    description: "You have been assigned the Finance Manager role.",
    time: "2 weeks ago",
    type: "role",
    read: true,
  },
]

// Notification type icons
const typeIcons: Record<string, React.ReactNode> = {
  registration: <Bell className="text-blue-500" size={20} />,
  payment: <Bell className="text-green-500" size={20} />,
  system: <Bell className="text-purple-500" size={20} />,
  application: <Bell className="text-orange-500" size={20} />,
  course: <Bell className="text-yellow-500" size={20} />,
  message: <Bell className="text-pink-500" size={20} />,
  account: <Bell className="text-indigo-500" size={20} />,
  role: <Bell className="text-red-500" size={20} />,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  // Filter notifications based on search term, type, and read status
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType ? notification.type === filterType : true
    const matchesReadStatus = showUnreadOnly ? !notification.read : true

    return matchesSearch && matchesType && matchesReadStatus
  })

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Get unique notification types
  const notificationTypes = Array.from(new Set(notifications.map((n) => n.type)))

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center px-3 py-2 text-sm bg-tertiary text-white rounded-lg hover:bg-tertiary/90 transition-colors"
            >
              <Check size={16} className="mr-2" />
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="flex items-center px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 size={16} className="mr-2" />
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-tertiary"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-backgroundsecondary transition-colors"
            >
              <Filter size={16} className="mr-2" />
              {filterType ? `Type: ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}` : "Filter by type"}
            </button>

            {showFilterMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10"
              >
                <button
                  onClick={() => {
                    setFilterType(null)
                    setShowFilterMenu(false)
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${!filterType ? "bg-backgroundsecondary" : "hover:bg-backgroundsecondary"}`}
                >
                  All types
                </button>
                {notificationTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type)
                      setShowFilterMenu(false)
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${filterType === type ? "bg-backgroundsecondary" : "hover:bg-backgroundsecondary"}`}
                  >
                    <div className="flex items-center">
                      {typeIcons[type]}
                      <span className="ml-2">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={() => setShowUnreadOnly(!showUnreadOnly)}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 ${showUnreadOnly ? "bg-tertiary" : "bg-gray-300"} rounded-full p-1 transition-colors duration-200 ease-in-out`}
            >
              <div
                className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${showUnreadOnly ? "translate-x-5" : "translate-x-0"}`}
              ></div>
            </div>
            <span className="ml-2 text-sm text-gray-700">Unread only</span>
          </label>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-backgroundsecondary transition-colors relative ${!notification.read ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1">{typeIcons[notification.type]}</div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                    <div className="flex items-center mt-2">
                      <Calendar size={14} className="text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-gray-400 hover:text-tertiary"
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                      title="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500">No notifications found</h3>
              <p className="text-gray-400 mt-1">
                {notifications.length === 0
                  ? "You don't have any notifications"
                  : "No notifications match your current filters"}
              </p>
              {notifications.length > 0 && (searchTerm || filterType || showUnreadOnly) && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterType(null)
                    setShowUnreadOnly(false)
                  }}
                  className="mt-4 text-tertiary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
