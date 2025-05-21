"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Shield, Calendar, Clock, Save, Eye, EyeOff } from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Mock user data
  const userData = {
    name: "Admin User",
    email: "admin@aslead.org",
    phone: "+254 712 345 678",
    role: "Admin",
    joinDate: "2022-01-15",
    lastLogin: "2023-05-15 14:30",
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-textDark mb-6">My Profile</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "profile"
                  ? "text-tertiary border-b-2 border-tertiary"
                  : "text-gray-500 hover:text-tertiary"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "password"
                  ? "text-tertiary border-b-2 border-tertiary"
                  : "text-gray-500 hover:text-tertiary"
              }`}
            >
              Change Password
            </button>
          </div>

          {activeTab === "profile" ? (
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="w-32 h-32 bg-tertiary rounded-full flex items-center justify-center text-white mb-4">
                    <User size={64} />
                  </div>
                  <h2 className="text-xl font-semibold text-textDark">{userData.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Shield size={14} className="mr-1" />
                    {userData.role}
                  </p>
                  <div className="mt-4 text-sm text-gray-600">
                    <div className="flex items-center mb-2">
                      <Calendar size={14} className="mr-2 text-gray-400" />
                      <span>Joined: {userData.joinDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-2 text-gray-400" />
                      <span>Last login: {userData.lastLogin}</span>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Full Name</label>
                      <input type="text" className="input-field" defaultValue={userData.name} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Email Address</label>
                      <div className="flex items-center">
                        <div className="input-field bg-backgroundsecondary flex items-center">
                          <Mail size={16} className="text-gray-400 mr-2" />
                          <span>{userData.email}</span>
                        </div>
                        <span className="ml-2 text-xs text-gray-500">(Cannot be changed)</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Phone Number</label>
                      <div className="relative">
                        <input type="tel" className="input-field pl-10" defaultValue={userData.phone} />
                        <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Role</label>
                      <div className="input-field bg-backgroundsecondary flex items-center">
                        <Shield size={16} className="text-gray-400 mr-2" />
                        <span>{userData.role}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Role changes must be made by a system administrator.</p>
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="btn-tertiary flex items-center justify-center">
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <form className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="input-field pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="input-field pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters and include uppercase, lowercase, number, and special
                    character.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="input-field pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="btn-tertiary w-full">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
