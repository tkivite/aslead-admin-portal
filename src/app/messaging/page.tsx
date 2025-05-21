"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Send, Upload, Users, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, X } from "lucide-react"
import Papa from "papaparse"

// Mock data for sent messages
const sentMessagesData = [
  {
    id: 1,
    subject: "Course Schedule Update",
    message:
      "Dear students, please note that the Leadership Development course schedule has been updated for next week. Classes will now be held from 9 AM to 12 PM instead of the usual afternoon slot.",
    recipients: 45,
    sentDate: "2023-05-15 14:30",
    status: "Delivered",
  },
  {
    id: 2,
    subject: "Payment Reminder",
    message:
      "This is a friendly reminder that the second installment for the Ethical Leadership course is due by the end of this week. Please ensure timely payment to avoid any interruption in your learning.",
    recipients: 32,
    sentDate: "2023-05-10 09:15",
    status: "Delivered",
  },
  {
    id: 3,
    subject: "New Course Announcement",
    message:
      "We are excited to announce a new course on Strategic Planning starting next month. Early bird registration is now open with a 15% discount for the first 20 students.",
    recipients: 120,
    sentDate: "2023-05-05 11:45",
    status: "Delivered",
  },
  {
    id: 4,
    subject: "Workshop Invitation",
    message:
      "You are cordially invited to attend our upcoming workshop on Conflict Resolution. The workshop will be held this Saturday from 10 AM to 2 PM at our main campus.",
    recipients: 75,
    sentDate: "2023-04-28 16:20",
    status: "Partial (68/75)",
  },
  {
    id: 5,
    subject: "System Maintenance Notice",
    message:
      "Our student portal will be undergoing maintenance this Sunday from 2 AM to 6 AM. During this time, the portal will be inaccessible. We apologize for any inconvenience.",
    recipients: 150,
    sentDate: "2023-04-20 13:10",
    status: "Failed",
  },
]

// Mock data for contact groups
const contactGroupsData = [
  { id: 1, name: "All Students", count: 150 },
  { id: 2, name: "Leadership Development", count: 45 },
  { id: 3, name: "Ethical Leadership", count: 32 },
  { id: 4, name: "Management Skills", count: 38 },
  { id: 5, name: "Communication Skills", count: 25 },
  { id: 6, name: "Staff", count: 12 },
]

export default function MessagingPage() {
  const [activeTab, setActiveTab] = useState("compose")
  const [selectedGroups, setSelectedGroups] = useState<number[]>([])
  const [showContactGroups, setShowContactGroups] = useState(false)
  const [uploadedContacts, setUploadedContacts] = useState<string[]>([])
  const [messageSubject, setMessageSubject] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle group selection
  const toggleGroupSelection = (groupId: number) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter((id) => id !== groupId))
    } else {
      setSelectedGroups([...selectedGroups, groupId])
    }
  }

  // Handle contact upload button click
  const handleContactUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is CSV
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Please upload a CSV file")
      return
    }

    // Parse CSV file
    Papa.parse(file, {
      complete: (results) => {
        const contacts: string[] = []

        // Process the parsed data
        results.data.forEach((row: any) => {
          // Assuming the CSV has a column with phone numbers or emails
          // This is a simple example - you might need more complex logic
          if (Array.isArray(row) && row.length > 0) {
            const contact = row[0]?.toString().trim()
            if (contact && !contacts.includes(contact)) {
              contacts.push(contact)
            }
          }
        })

        setUploadedContacts(contacts)
        alert(`Successfully extracted ${contacts.length} contacts from CSV`)
      },
      header: true,
      skipEmptyLines: true,
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle removing an uploaded contact
  const removeUploadedContact = (contact: string) => {
    setUploadedContacts(uploadedContacts.filter((c) => c !== contact))
  }

  // Handle sending message
  const handleSendMessage = () => {
    if (!messageSubject.trim()) {
      alert("Please enter a subject for your message")
      return
    }

    if (!messageContent.trim()) {
      alert("Please enter content for your message")
      return
    }

    if (selectedGroups.length === 0 && uploadedContacts.length === 0) {
      alert("Please select at least one recipient group or upload contacts")
      return
    }

    // In a real application, this would call an API to send the message
    alert("Message sent successfully!")

    // Reset form
    setMessageSubject("")
    setMessageContent("")
    setSelectedGroups([])
    setUploadedContacts([])
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-textDark mb-6">Messaging</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("compose")}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "compose"
                  ? "text-tertiary border-b-2 border-tertiary"
                  : "text-gray-500 hover:text-tertiary"
              }`}
            >
              Compose Message
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "sent" ? "text-tertiary border-b-2 border-tertiary" : "text-gray-500 hover:text-tertiary"
              }`}
            >
              Sent Messages
            </button>
          </div>

          {activeTab === "compose" ? (
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-textDark mb-1">Recipients</label>
                <div className="flex flex-col space-y-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowContactGroups(!showContactGroups)}
                      className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tertiary"
                    >
                      <span>
                        {selectedGroups.length > 0
                          ? `${selectedGroups.length} groups selected`
                          : "Select contact groups"}
                      </span>
                      {showContactGroups ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    {showContactGroups && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                      >
                        {contactGroupsData.map((group) => (
                          <div
                            key={group.id}
                            className="flex items-center px-4 py-2 hover:bg-backgroundsecondary cursor-pointer"
                            onClick={() => toggleGroupSelection(group.id)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedGroups.includes(group.id)}
                              onChange={() => {}}
                              className="mr-2"
                            />
                            <span>{group.name}</span>
                            <span className="ml-auto text-sm text-gray-500">{group.count} contacts</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="px-3 text-sm text-gray-500">OR</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".csv"
                      className="hidden"
                    />
                    <button
                      onClick={handleContactUploadClick}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-backgroundsecondary transition-colors"
                    >
                      <Upload size={18} className="mr-2" />
                      Upload Contacts (CSV)
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a CSV file with contacts. The file should have a column with phone numbers or emails.
                    </p>
                  </div>

                  {uploadedContacts.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-textDark mb-2">
                        Uploaded Contacts ({uploadedContacts.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {uploadedContacts.map((contact, index) => (
                          <div key={index} className="flex items-center bg-backgroundsecondary px-3 py-1 rounded-full">
                            <span className="text-sm">{contact}</span>
                            <button
                              onClick={() => removeUploadedContact(contact)}
                              className="ml-2 text-gray-500 hover:text-red-500"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-textDark mb-1">Subject</label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="input-field"
                  placeholder="Enter message subject"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-textDark mb-1">Message</label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="input-field min-h-[200px]"
                  placeholder="Enter your message here..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSendMessage} className="btn-tertiary flex items-center">
                  <Send size={18} className="mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-backgroundsecondary">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                        Recipients
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                        Sent Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sentMessagesData.map((message, index) => (
                      <motion.tr
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-backgroundsecondary cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-textDark">{message.subject}</div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">{message.message}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-textDark">
                            <Users size={16} className="mr-2 text-gray-400" />
                            {message.recipients} recipients
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-textDark">
                            <Clock size={16} className="mr-2 text-gray-400" />
                            {message.sentDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`flex items-center text-sm ${
                              message.status === "Delivered"
                                ? "text-green-600"
                                : message.status.startsWith("Partial")
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {message.status === "Delivered" ? (
                              <CheckCircle size={16} className="mr-1" />
                            ) : message.status.startsWith("Partial") ? (
                              <AlertCircle size={16} className="mr-1" />
                            ) : (
                              <AlertCircle size={16} className="mr-1" />
                            )}
                            {message.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
