"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash, Shield, Mail, Phone, Eye, EyeOff } from "lucide-react"

// Mock data for users
const usersData = [
  {
    id: 1,
    name: "John Admin",
    email: "john.admin@aslead.org",
    phone: "+254 712 345 678",
    role: "Admin",
    status: "Active",
    lastLogin: "2023-05-15 14:30",
  },
  {
    id: 2,
    name: "Sarah Finance",
    email: "sarah.finance@aslead.org",
    phone: "+254 723 456 789",
    role: "Finance",
    status: "Active",
    lastLogin: "2023-05-14 09:15",
  },
  {
    id: 3,
    name: "Michael Manager",
    email: "michael.manager@aslead.org",
    phone: "+254 734 567 890",
    role: "Manager",
    status: "Active",
    lastLogin: "2023-05-13 11:45",
  },
  {
    id: 4,
    name: "Emily Staff",
    email: "emily.staff@aslead.org",
    phone: "+254 745 678 901",
    role: "Staff",
    status: "Inactive",
    lastLogin: "2023-04-28 16:20",
  },
  {
    id: 5,
    name: "David Instructor",
    email: "david.instructor@aslead.org",
    phone: "+254 756 789 012",
    role: "Instructor",
    status: "Active",
    lastLogin: "2023-05-10 13:10",
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<number | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "Active",
    password: "",
  })

  // Filter users based on search term
  const filteredUsers = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle edit user
  const handleEditUser = (userId: number) => {
    const user = usersData.find((u) => u.id === userId)
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        password: "", // Don't populate password for security
      })
      setEditingUser(userId)
      setShowAddUserForm(true)
    }
  }

  // Handle delete user
  const handleDeleteUser = (userId: number) => {
    setShowDeleteConfirm(userId)
  }

  // Confirm delete user
  const confirmDeleteUser = () => {
    if (showDeleteConfirm) {
      // In a real application, this would call an API to delete the user
      alert(`User ${showDeleteConfirm} has been deleted`)
      setShowDeleteConfirm(null)
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email || !formData.role) {
      alert("Please fill in all required fields")
      return
    }

    if (editingUser) {
      // In a real application, this would call an API to update the user
      alert(`User ${editingUser} has been updated`)
    } else {
      // In a real application, this would call an API to create a new user
      alert("New user has been created")
    }

    // Reset form and close modal
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      status: "Active",
      password: "",
    })
    setEditingUser(null)
    setShowAddUserForm(false)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <h1 className="text-2xl font-bold text-textDark">User Management</h1>
        <button
          onClick={() => {
            setEditingUser(null)
            setFormData({
              name: "",
              email: "",
              phone: "",
              role: "",
              status: "Active",
              password: "",
            })
            setShowAddUserForm(true)
          }}
          className="btn-tertiary flex items-center justify-center"
        >
          <Plus size={18} className="mr-2" />
          Add New User
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-backgroundsecondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-backgroundsecondary"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-textDark">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-textDark flex flex-col">
                      <div className="flex items-center">
                        <Mail size={14} className="mr-1 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center mt-1">
                        <Phone size={14} className="mr-1 text-gray-400" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield size={16} className="mr-2 text-tertiary" />
                      <span className="text-sm text-textDark">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">{user.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className="text-tertiary hover:text-primary transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit User Modal */}
      {showAddUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">{editingUser ? "Edit User" : "Add New User"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Finance">Finance</option>
                    <option value="Manager">Manager</option>
                    <option value="Staff">Staff</option>
                    <option value="Instructor">Instructor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="input-field">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input-field pr-10"
                      placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                      {...(editingUser ? {} : { required: true })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {!editingUser && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    A temporary password will be generated and sent to the user&apos;s email address. They will be prompted
                    to change it upon first login.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-tertiary">
                  {editingUser ? "Update User" : "Add User"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
