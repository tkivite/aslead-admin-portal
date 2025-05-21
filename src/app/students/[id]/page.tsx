"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, User, Mail, Phone, Calendar, BookOpen, Clock, DollarSign, Edit, Save, Trash } from "lucide-react"

interface Student {
  id: number
  name: string
  email: string
  phone: string
  course: string
  class: string 
  enrollmentDate: string
  paymentStatus: string
  address: string
  emergencyContact: string
  educationBackground: string 
  paymentHistory: {
    id: number
    amount: number
    date: string
    method: string
    reference: string
  }[]
}
interface Payment {
   id: number
    amount: number
    date: string
    method: string
    reference: string
}

// Mock student data
const studentsData:Student[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+254 712 345 678",
    course: "Leadership Development",
    class: "Morning",
    enrollmentDate: "2023-01-15",
    paymentStatus: "Full",
    address: "123 Main St, Nairobi",
    emergencyContact: "Jane Doe, +254 712 345 679",
    educationBackground: "Bachelor's in Business Administration",
    paymentHistory: [
      { id: "PAY-001245", amount: 500, date: "2023-01-10", method: "M-Pesa", reference: "MPESA123456" },
      { id: "PAY-001245", amount: 700, date: "2023-02-05", method: "Bank Transfer", reference: "BT789012" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+254 723 456 789",
    course: "Ethical Leadership",
    class: "Evening",
    enrollmentDate: "2023-02-10",
    paymentStatus: "Partial",
    address: "456 Park Ave, Nairobi",
    emergencyContact: "John Smith, +254 723 456 780",
    educationBackground: "Master's in Public Administration",
    paymentHistory: [{ id: 3, amount: 600, date: "2023-02-08", method: "M-Pesa", reference: "MPESA234567" }],
  },
  // Add more students as needed
]

export default function StudentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const studentId = Number(params.id)

  const [student, setStudent] = useState<Student|null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedStudent, setEditedStudent] = useState<Student|null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    // In a real app, this would be an API call
    const foundStudent = studentsData.find((s) => s.id === studentId)
    if (!foundStudent) {
      router.push("/students")
      return
    }
    setStudent(foundStudent)
    setEditedStudent(foundStudent ? { ...foundStudent } : null)
  }, [studentId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (!editedStudent) return
    setEditedStudent({
      ...editedStudent,
      [name]: value,
    })
  }

  const handleSave = () => {
    // In a real app, this would be an API call
    setStudent(editedStudent)
    setIsEditing(false)
    alert("Student information updated successfully!")
  }

  const handleDelete = () => {
    // In a real app, this would be an API call
    alert(`Student ${studentId} deleted successfully!`)
    router.push("/students")
  }

  // Handle view receipt
  const handleViewReceipt = (paymentId: string) => {
    router.push(`/payments/receipt/${paymentId}`)
  }
  if (!student) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading student information...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="flex items-center">
          <button
            onClick={() => router.push("/students")}
            className="mr-4 p-2 rounded-full hover:bg-backgroundsecondary"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-textDark">Student Details</h1>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <button onClick={handleSave} className="btn-tertiary flex items-center">
              <Save size={18} className="mr-2" />
              Save Changes
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn-tertiary flex items-center">
              <Edit size={18} className="mr-2" />
              Edit Student
            </button>
          )}
          <button onClick={() => setShowDeleteConfirm(true)} className="btn-accent flex items-center">
            <Trash size={18} className="mr-2" />
            Delete Student
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-1"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-tertiary rounded-full flex items-center justify-center text-white mb-4">
                <User size={40} />
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedStudent?.name}
                  onChange={handleInputChange}
                  className="text-xl font-semibold text-center input-field"
                />
              ) : (
                <h2 className="text-xl font-semibold">{student.name}</h2>
              )}
              <span className="text-sm text-gray-500">Student ID: {student.id}</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="text-tertiary mr-3 mt-1" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedStudent?.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-sm font-medium">{student.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="text-tertiary mr-3 mt-1" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedStudent?.phone}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-sm font-medium">{student.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="text-tertiary mr-3 mt-1" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Enrollment Date</p>
                  {isEditing ? (
                    <input
                      type="date"
                      name="enrollmentDate"
                      value={editedStudent?.enrollmentDate}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-sm font-medium">{student.enrollmentDate}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <BookOpen className="text-tertiary mr-3 mt-1" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Course</p>
                  {isEditing ? (
                    <select
                      name="course"
                      value={editedStudent?.course}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="Leadership Development">Leadership Development</option>
                      <option value="Ethical Leadership">Ethical Leadership</option>
                      <option value="Management Skills">Management Skills</option>
                      <option value="Communication Skills">Communication Skills</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium">{student.course}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="text-tertiary mr-3 mt-1" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Class</p>
                  {isEditing ? (
                    <select
                      name="class"
                      value={editedStudent?.class}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                      <option value="Weekend">Weekend</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium">{student.class}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <DollarSign className="text-tertiary mr-3 mt-1" size={18} />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Payment Status</p>
                  {isEditing ? (
                    <select
                      name="paymentStatus"
                      value={editedStudent?.paymentStatus}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="Full">Full</option>
                      <option value="Partial">Partial</option>
                      <option value="None">None</option>
                    </select>
                  ) : (
                    <p
                      className={`text-sm font-medium ${
                        student.paymentStatus === "Full"
                          ? "text-green-600"
                          : student.paymentStatus === "Partial"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {student.paymentStatus}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2"
        >
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editedStudent?.address}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-sm">{student.address}</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Emergency Contact</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergencyContact"
                    value={editedStudent?.emergencyContact}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-sm">{student.emergencyContact}</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Education Background</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="educationBackground"
                    value={editedStudent?.educationBackground}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-sm">{student.educationBackground}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Payment History</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-backgroundsecondary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {student.paymentHistory.map((payment: Payment) => (
                    <tr key={payment.id} className="hover:bg-backgroundsecondary">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">${payment.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.method}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{payment.reference}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewReceipt(payment.id.toString())}
                          className="text-tertiary hover:text-primary"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete {student.name}? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
