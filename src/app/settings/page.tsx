"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, MessageSquare, Mail, Globe, Shield } from "lucide-react"
import SearchableSelect from "@/app/components/common/SearchableSelect"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  // Local state for selects
  const [timezone, setTimezone] = useState<string | null>("Africa/Nairobi")
  const [dateFormat, setDateFormat] = useState<string | null>("YYYY-MM-DD")
  const [smsProvider, setSmsProvider] = useState<string | null>("africastalking")
  const [encryption, setEncryption] = useState<string | null>("tls")
  const [twoFactor, setTwoFactor] = useState<string | null>("disabled")

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Settings saved successfully!")
  }



  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-textDark mb-6">System Settings</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200">
            <button
              onClick={() => setActiveTab("general")}
              className={`py-4 px-6 text-center font-medium ${
                activeTab === "general"
                  ? "text-tertiary border-b-2 border-tertiary"
                  : "text-gray-500 hover:text-tertiary"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab("sms")}
              className={`py-4 px-6 text-center font-medium ${
                activeTab === "sms" ? "text-tertiary border-b-2 border-tertiary" : "text-gray-500 hover:text-tertiary"
              }`}
            >
              SMS Configuration
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`py-4 px-6 text-center font-medium ${
                activeTab === "email" ? "text-tertiary border-b-2 border-tertiary" : "text-gray-500 hover:text-tertiary"
              }`}
            >
              Email Configuration
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-4 px-6 text-center font-medium ${
                activeTab === "security"
                  ? "text-tertiary border-b-2 border-tertiary"
                  : "text-gray-500 hover:text-tertiary"
              }`}
            >
              Security
            </button>
           
          </div>

          <div className="p-6">
            {activeTab === "general" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="max-w-3xl">
                  <h2 className="text-lg font-semibold mb-4">General Settings</h2>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Institute Name</label>
                      <input
                        type="text"
                        className="input-field"
                        defaultValue="Africa Servant Leadership Development Institute"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Contact Email</label>
                      <div className="relative">
                        <input type="email" className="input-field pl-10" defaultValue="info@aslead.org" />
                        <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Website URL</label>
                      <div className="relative">
                        <input type="url" className="input-field pl-10" defaultValue="https://www.aslead.org" />
                        <Globe size={16} className="absolute left-3 top-3 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Timezone</label>
                      <SearchableSelect
                        options={[
                          { value: "Africa/Nairobi", label: "Africa/Nairobi (EAT)" },
                          { value: "UTC", label: "UTC" },
                          { value: "America/New_York", label: "America/New_York (EST)" },
                          { value: "Europe/London", label: "Europe/London (GMT)" },
                        ]}
                        value={timezone}
                        onChange={(v: string | number | null) => setTimezone(v?.toString() ?? null)}
                        placeholder="Select timezone"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Date Format</label>
                      <SearchableSelect
                        options={[
                          { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                          { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                          { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                          { value: "DD-MMM-YYYY", label: "DD-MMM-YYYY" },
                        ]}
                        value={dateFormat}
                        onChange={(v: string | number | null) => setDateFormat(v?.toString() ?? null)}
                        placeholder="Select date format"
                        className="w-full"
                      />
                    </div>
                    <div className="pt-4">
                      <button type="submit" className="btn-tertiary flex items-center">
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === "sms" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="max-w-3xl">
                  <h2 className="text-lg font-semibold mb-4">SMS Configuration</h2>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">SMS Provider</label>
                      <SearchableSelect
                        options={[
                          { value: "africastalking", label: "Africa's Talking" },
                          { value: "twilio", label: "Twilio" },
                          { value: "infobip", label: "Infobip" },
                        ]}
                        value={smsProvider}
                        onChange={(v: string | number | null) => setSmsProvider(v?.toString() ?? null)}
                        placeholder="Select provider"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">API Key</label>
                      <input type="password" className="input-field" placeholder="Enter API key" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Sender ID</label>
                      <div className="relative">
                        <input type="text" className="input-field pl-10" defaultValue="ASLEAD" />
                        <MessageSquare size={16} className="absolute left-3 top-3 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        This is the name that will appear as the sender of SMS messages.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Default SMS Template</label>
                      <textarea
                        className="input-field min-h-[100px]"
                        defaultValue="Dear {name}, {message} - ASLEAD"
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">
                        Use {"{name}"} and {"{message}"} as placeholders in your template.
                      </p>
                    </div>
                    <div className="pt-4">
                      <button type="submit" className="btn-tertiary flex items-center">
                        <Save size={18} className="mr-2" />
                        Save SMS Configuration
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === "email" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="max-w-3xl">
                  <h2 className="text-lg font-semibold mb-4">Email Configuration</h2>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">SMTP Server</label>
                      <input type="text" className="input-field" placeholder="e.g. smtp.gmail.com" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-textDark mb-1">SMTP Port</label>
                        <input type="number" className="input-field" placeholder="e.g. 587" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-textDark mb-1">Encryption</label>
                        <SearchableSelect
                          options={[
                            { value: "tls", label: "TLS" },
                            { value: "ssl", label: "SSL" },
                            { value: "none", label: "None" },
                          ]}
                          value={encryption}
                          onChange={(v: string | number | null) => setEncryption(v?.toString() ?? null)}
                          placeholder="Select encryption"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">SMTP Username</label>
                      <input type="text" className="input-field" placeholder="Enter username" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">SMTP Password</label>
                      <input type="password" className="input-field" placeholder="Enter password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">From Email</label>
                      <div className="relative">
                        <input type="email" className="input-field pl-10" placeholder="e.g. no-reply@aslead.org" />
                        <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">From Name</label>
                      <input type="text" className="input-field" placeholder="e.g. ASLEAD Admin" />
                    </div>
                    <div className="pt-4">
                      <button type="submit" className="btn-tertiary flex items-center">
                        <Save size={18} className="mr-2" />
                        Save Email Configuration
                      </button>
                    </div>
                  </form>
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
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Session Timeout (minutes)</label>
                      <input type="number" className="input-field" defaultValue="30" min="5" max="120" />
                      <p className="text-xs text-gray-500 mt-1">
                        Users will be automatically logged out after this period of inactivity.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Password Policy</label>
                      <div className="space-y-2 bg-backgroundsecondary p-4 rounded-md">
                        <div className="flex items-center">
                          <input type="checkbox" id="min-length" className="mr-2" defaultChecked />
                          <label htmlFor="min-length" className="text-sm text-textDark">
                            Minimum 8 characters
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="uppercase" className="mr-2" defaultChecked />
                          <label htmlFor="uppercase" className="text-sm text-textDark">
                            Require uppercase letters
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="lowercase" className="mr-2" defaultChecked />
                          <label htmlFor="lowercase" className="text-sm text-textDark">
                            Require lowercase letters
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="numbers" className="mr-2" defaultChecked />
                          <label htmlFor="numbers" className="text-sm text-textDark">
                            Require numbers
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="special" className="mr-2" defaultChecked />
                          <label htmlFor="special" className="text-sm text-textDark">
                            Require special characters
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="expiry" className="mr-2" />
                          <label htmlFor="expiry" className="text-sm text-textDark">
                            Password expires after 90 days
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Login Attempts</label>
                      <input type="number" className="input-field" defaultValue="5" min="3" max="10" />
                      <p className="text-xs text-gray-500 mt-1">
                        Number of failed login attempts before account is temporarily locked.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textDark mb-1">Two-Factor Authentication</label>
                      <div className="flex items-center">
                        <SearchableSelect
                          options={[
                            { value: "disabled", label: "Disabled" },
                            { value: "optional", label: "Optional for users" },
                            { value: "required", label: "Required for all users" },
                            { value: "admin-only", label: "Required for admin users only" },
                          ]}
                          value={twoFactor}
                          onChange={(v: string | number | null) => setTwoFactor(v?.toString() ?? null)}
                          placeholder="Select 2FA"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button type="submit" className="btn-tertiary flex items-center">
                        <Shield size={18} className="mr-2" />
                        Save Security Settings
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

        
          </div>
        </div>
      </motion.div>
    </div>
  )
}
