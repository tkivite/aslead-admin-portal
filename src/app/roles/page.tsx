"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash, Shield, Check, X } from "lucide-react"

// Mock data for roles
const rolesData = [
  {
    id: 1,
    name: "Admin",
    description: "Full access to all system features and settings",
    usersCount: 3,
    permissions: {
      dashboard: true,
      students: true,
      courses: true,
      payments: true,
      messaging: true,
      reports: true,
      finance: true,
      users: true,
      roles: true,
      settings: true,
    },
  },
  {
    id: 2,
    name: "Finance",
    description: "Access to financial records, payments, and reports",
    usersCount: 2,
    permissions: {
      dashboard: true,
      students: true,
      courses: false,
      payments: true,
      messaging: false,
      reports: true,
      finance: true,
      users: false,
      roles: false,
      settings: false,
    },
  },
  {
    id: 3,
    name: "Manager",
    description: "Manages courses, students, and general operations",
    usersCount: 4,
    permissions: {
      dashboard: true,
      students: true,
      courses: true,
      payments: false,
      messaging: true,
      reports: true,
      finance: false,
      users: false,
      roles: false,
      settings: false,
    },
  },
  {
    id: 4,
    name: "Staff",
    description: "Basic access to student records and courses",
    usersCount: 6,
    permissions: {
      dashboard: true,
      students: true,
      courses: true,
      payments: false,
      messaging: true,
      reports: false,
      finance: false,
      users: false,
      roles: false,
      settings: false,
    },
  },
  {
    id: 5,
    name: "Instructor",
    description: "Access to assigned courses and student information",
    usersCount: 8,
    permissions: {
      dashboard: true,
      students: true,
      courses: true,
      payments: false,
      messaging: true,
      reports: false,
      finance: false,
      users: false,
      roles: false,
      settings: false,
    },
  },
]

// List of all possible permissions
const allPermissions = [
  { id: "dashboard", name: "Dashboard" },
  { id: "students", name: "Students Management" },
  { id: "courses", name: "Courses Management" },
  { id: "payments", name: "Payments" },
  { id: "messaging", name: "Messaging" },
  { id: "reports", name: "Reports" },
  { id: "finance", name: "Finance" },
  { id: "users", name: "User Management" },
  { id: "roles", name: "Role Management" },
  { id: "settings", name: "System Settings" },
]

export default function RolesPage() {
  const [showAddRoleForm, setShowAddRoleForm] = useState(false)
  const [editingRole, setEditingRole] = useState<number | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({})

  // Handle edit role
  const handleEditRole = (roleId: number) => {
    const role = rolesData.find((r) => r.id === roleId)
    if (role) {
      setSelectedPermissions(role.permissions)
      setEditingRole(roleId)
      setShowAddRoleForm(true)
    }
  }

  // Handle delete role
  const handleDeleteRole = (roleId: number) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      // In a real application, this would call an API to delete the role
      alert(`Role ${roleId} would be deleted`)
    }
  }

  // Toggle permission selection
  const togglePermission = (permissionId: string) => {
    setSelectedPermissions({
      ...selectedPermissions,
      [permissionId]: !selectedPermissions[permissionId],
    })
  }

  // Reset form when adding a new role
  const handleAddNewRole = () => {
    setSelectedPermissions({})
    setEditingRole(null)
    setShowAddRoleForm(true)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <h1 className="text-2xl font-bold text-textDark">Role Management</h1>
        <button onClick={handleAddNewRole} className="btn-tertiary flex items-center justify-center">
          <Plus size={18} className="mr-2" />
          Add New Role
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {rolesData.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Shield size={20} className="text-tertiary mr-2" />
                  <h3 className="text-lg font-semibold text-textDark">{role.name}</h3>
                </div>
                <span className="text-xs text-gray-500">{role.usersCount} users</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{role.description}</p>

              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium text-textDark">Permissions:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {allPermissions.slice(0, 6).map((permission) => (
                    <div key={permission.id} className="flex items-center text-sm">
                      {role.permissions[permission.id as keyof typeof role.permissions] ? (
                        <Check size={14} className="text-green-500 mr-1" />
                      ) : (
                        <X size={14} className="text-red-500 mr-1" />
                      )}
                      <span className="text-gray-600">{permission.name}</span>
                    </div>
                  ))}
                </div>
               
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleEditRole(role.id)}
                  className="p-2 text-tertiary hover:text-primary transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add/Edit Role Modal */}
      {showAddRoleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">{editingRole ? "Edit Role" : "Add New Role"}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Role Name</label>
                  <input type="text" className="input-field" placeholder="Enter role name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Description</label>
                  <textarea className="input-field min-h-[80px]" placeholder="Enter role description"></textarea>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-backgroundsecondary p-4 rounded-md">
                  {allPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`permission-${permission.id}`}
                        checked={selectedPermissions[permission.id] || false}
                        onChange={() => togglePermission(permission.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`permission-${permission.id}`} className="text-sm text-textDark">
                        {permission.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddRoleForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button className="btn-tertiary">{editingRole ? "Update Role" : "Add Role"}</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
