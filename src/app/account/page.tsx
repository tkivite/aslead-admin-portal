"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Moon, Sun, Lock, Shield, Eye, EyeOff, Save } from "lucide-react"

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState("preferences")
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-textDark mb-6">Account Settings</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "preferences"
                  ? "text-tertiary border-b-2 border-tertiary"
                  : "text-gray-500 hover:text-tertiary"
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "notifications"
                  ? "text-tertiary border-b-2 border-tertiary"
                  : "text-gray-500 hover:text-tertiary"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "security"
                  ? "text-tertiary border-b-2 border-tertiary"
                  : "text-gray-500 hover:text-tertiary"
              }`}
            >
              Security
            </button>
          </div>

          <div className="p-6">
            {activeTab === "preferences" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="max-w-3xl">
                  <h2 className="text-lg font-semibold mb-4">Display Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-backgroundsecondary rounded-md">
                      <div className="flex items-center">
                        {darkMode ? <Moon size={20} className="mr-3" /> : <Sun size={20} className="mr-3" />}
                        <div>
                          <h3 className="font-medium">Dark Mode</h3>
                          <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={darkMode}
                          onChange={() => setDarkMode(!darkMode)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-tertiary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                      </label>
                    </div>

                    <div className="p-4 bg-backgroundsecondary rounded-md">
                      <h3 className="font-medium mb-3">Language</h3>
                      <select className="input-field">
                        <option value="en">English</option>
                        <option value="fr">French</option>
                        <option value="es">Spanish</option>
                        <option value="sw">Swahili</option>
                      </select>
                    </div>

                    <div className="p-4 bg-backgroundsecondary rounded-md">
                      <h3 className="font-medium mb-3">Time Zone</h3>
                      <select className="input-field">
                        <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                      </select>
                    </div>

                    <div className="p-4 bg-backgroundsecondary rounded-md">
                      <h3 className="font-medium mb-3">Date Format</h3>
                      <select className="input-field">
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD-MMM-YYYY">DD-MMM-YYYY</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button type="submit" className="btn-tertiary flex items-center">
                      <Save size={18} className="mr-2" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="max-w-3xl">
                  <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-backgroundsecondary rounded-md">
                      <div className="flex items-center">
                        <Bell size={20} className="mr-3" />
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-tertiary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                      </label>
                    </div>

                    {emailNotifications && (
                      <div className="ml-8 space-y-3">
                        <div className="flex items-center">
                          <input type="checkbox" id="email-students" className="mr-2" defaultChecked />
                          <label htmlFor="email-students" className="text-sm">
                            Student registrations
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="email-payments" className="mr-2" defaultChecked />
                          <label htmlFor="email-payments" className="text-sm">
                            Payment notifications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="email-courses" className="mr-2" defaultChecked />
                          <label htmlFor="email-courses" className="text-sm">
                            Course updates
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="email-system" className="mr-2" defaultChecked />
                          <label htmlFor="email-system" className="text-sm">
                            System notifications
                          </label>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 bg-backgroundsecondary rounded-md">
                      <div className="flex items-center">
                        <Bell size={20} className="mr-3" />
                        <div>
                          <h3 className="font-medium">SMS Notifications</h3>
                          <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={smsNotifications}
                          onChange={() => setSmsNotifications(!smsNotifications)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-tertiary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                      </label>
                    </div>

                    {smsNotifications && (
                      <div className="ml-8 space-y-3">
                        <div className="flex items-center">
                          <input type="checkbox" id="sms-payments" className="mr-2" defaultChecked />
                          <label htmlFor="sms-payments" className="text-sm">
                            Payment notifications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="sms-urgent" className="mr-2" defaultChecked />
                          <label htmlFor="sms-urgent" className="text-sm">
                            Urgent system alerts
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <button type="submit" className="btn-tertiary flex items-center">
                      <Save size={18} className="mr-2" />
                      Save Notification Settings
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="max-w-3xl">
                  <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-backgroundsecondary rounded-md">
                      <h3 className="font-medium mb-3">Change Password</h3>
                      <div className="space-y-4">
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
                        <button className="btn-tertiary flex items-center">
                          <Lock size={18} className="mr-2" />
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-backgroundsecondary rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield size={20} className="mr-3" />
                          <div>
                            <h3 className="font-medium">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                        </div>
                        <button className="btn-secondary">Enable</button>
                      </div>
                    </div>

                    <div className="p-4 bg-backgroundsecondary rounded-md">
                      <h3 className="font-medium mb-3">Login Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-xs text-gray-500">Nairobi, Kenya • Chrome on Windows</p>
                            <p className="text-xs text-gray-500">Started: Today at 14:30</p>
                          </div>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                          <div>
                            <p className="font-medium">Previous Session</p>
                            <p className="text-xs text-gray-500">Nairobi, Kenya • Safari on Mac</p>
                            <p className="text-xs text-gray-500">Last active: Yesterday at 10:15</p>
                          </div>
                          <button className="text-sm text-red-500 hover:text-red-700">Revoke</button>
                        </div>
                      </div>
                      <button className="mt-3 text-sm text-red-500 hover:text-red-700 font-medium">
                        Logout from all devices
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
