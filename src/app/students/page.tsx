"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Download, Plus, ChevronLeft, ChevronRight, Mail, Phone, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data for students
const studentsData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+254 712 345 678",
    course: "Leadership Development",
    class: "Morning",
    enrollmentDate: "2023-01-15",
    paymentStatus: "Full",
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
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "+254 734 567 890",
    course: "Management Skills",
    class: "Weekend",
    enrollmentDate: "2023-02-20",
    paymentStatus: "None",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "+254 745 678 901",
    course: "Communication Skills",
    class: "Morning",
    enrollmentDate: "2023-03-05",
    paymentStatus: "Full",
  },
  {
    id: 5,
    name: "Robert Brown",
    email: "robert.b@example.com",
    phone: "+254 756 789 012",
    course: "Leadership Development",
    class: "Evening",
    enrollmentDate: "2023-03-15",
    paymentStatus: "Partial",
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "+254 767 890 123",
    course: "Ethical Leadership",
    class: "Weekend",
    enrollmentDate: "2023-04-01",
    paymentStatus: "Full",
  },
  {
    id: 7,
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "+254 778 901 234",
    course: "Management Skills",
    class: "Morning",
    enrollmentDate: "2023-04-10",
    paymentStatus: "None",
  },
  {
    id: 8,
    name: "Jennifer Taylor",
    email: "jennifer.t@example.com",
    phone: "+254 789 012 345",
    course: "Communication Skills",
    class: "Evening",
    enrollmentDate: "2023-04-20",
    paymentStatus: "Full",
  },
  {
    id: 9,
    name: "Daniel Anderson",
    email: "daniel.a@example.com",
    phone: "+254 790 123 456",
    course: "Leadership Development",
    class: "Weekend",
    enrollmentDate: "2023-05-01",
    paymentStatus: "Partial",
  },
  {
    id: 10,
    name: "Lisa Thomas",
    email: "lisa.t@example.com",
    phone: "+254 701 234 567",
    course: "Ethical Leadership",
    class: "Morning",
    enrollmentDate: "2023-05-10",
    paymentStatus: "Full",
  },
]

// Available courses and classes for filtering
const courses = [
  "All Courses",
  "Leadership Development",
  "Ethical Leadership",
  "Management Skills",
  "Communication Skills",
]

const classes = ["All Classes", "Morning", "Evening", "Weekend"]

export default function StudentsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("All Courses")
  const [selectedClass, setSelectedClass] = useState("All Classes")
  const [showFilters, setShowFilters] = useState(false)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const studentsPerPage = 5

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    course: "",
    class: "",
    enrollmentDate: "",
    paymentStatus: "",
    amountPaid: "",
  })

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
    if (!formData.fullName || !formData.email || !formData.course || !formData.class) {
      alert("Please fill in all required fields")
      return
    }

    // In a real application, this would call an API to register the student
    alert("Student registration submitted successfully!")
    setShowRegisterForm(false)

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      course: "",
      class: "",
      enrollmentDate: "",
      paymentStatus: "",
      amountPaid: "",
    })
  }

  // Filter students based on search term and filters
  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCourse = selectedCourse === "All Courses" || student.course === selectedCourse

    const matchesClass = selectedClass === "All Classes" || student.class === selectedClass

    return matchesSearch && matchesCourse && matchesClass
  })

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)

  // Handle export data to CSV
  const handleExportData = () => {
    // Create CSV content
    const headers = ["Name", "Email", "Phone", "Course", "Class", "Enrollment Date", "Payment Status"]
    const csvContent = [
      headers.join(","),
      ...filteredStudents.map((student) =>
        [
          `"${student.name}"`,
          `"${student.email}"`,
          `"${student.phone}"`,
          `"${student.course}"`,
          `"${student.class}"`,
          `"${student.enrollmentDate}"`,
          `"${student.paymentStatus}"`,
        ].join(","),
      ),
    ].join("\n")

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `students_export_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle view student
  const handleViewStudent = (studentId: number) => {
    router.push(`/students/${studentId}`)
  }


  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <h1 className="text-2xl font-bold text-textDark">Students</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => setShowRegisterForm(true)} className="btn-tertiary flex items-center justify-center">
            <Plus size={18} className="mr-2" />
            Register Student
          </button>
          <button onClick={handleExportData} className="btn-secondary flex items-center justify-center">
            <Download size={18} className="mr-2" />
            Export Data
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-2 bg-backgroundsecondary rounded-md hover:bg-gray-200 transition-colors"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="input-field"
              >
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Class</label>
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="input-field">
                {classes.map((classOption) => (
                  <option key={classOption} value={classOption}>
                    {classOption}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-backgroundsecondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Enrollment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStudents.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-backgroundsecondary"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-textDark">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-textDark flex flex-col">
                      <div className="flex items-center">
                        <Mail size={14} className="mr-1 text-gray-400" />
                        {student.email}
                      </div>
                      <div className="flex items-center mt-1">
                        <Phone size={14} className="mr-1 text-gray-400" />
                        {student.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">{student.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">{student.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-textDark">
                      <Calendar size={14} className="mr-1 text-gray-400" />
                      {student.enrollmentDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.paymentStatus === "Full"
                          ? "bg-green-100 text-green-800"
                          : student.paymentStatus === "Partial"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewStudent(student.id)}
                        className="text-tertiary hover:text-primary transition-colors"
                      >
                        View
                      </button>
                     
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of{" "}
            {filteredStudents.length} students
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md bg-backgroundsecondary hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-md bg-backgroundsecondary hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Student Registration Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Register New Student</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input-field"
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Course</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Course</option>
                    <option value="Leadership Development">Leadership Development</option>
                    <option value="Ethical Leadership">Ethical Leadership</option>
                    <option value="Management Skills">Management Skills</option>
                    <option value="Communication Skills">Communication Skills</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Class</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Class</option>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Weekend">Weekend</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Enrollment Date</label>
                  <input
                    type="date"
                    name="enrollmentDate"
                    value={formData.enrollmentDate}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-textDark mb-1">Payment Status</label>
                    <select
                      name="paymentStatus"
                      value={formData.paymentStatus}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Select Status</option>
                      <option value="Full">Full Payment</option>
                      <option value="Partial">Partial Payment</option>
                      <option value="None">No Payment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textDark mb-1">Amount Paid</label>
                    <input
                      type="number"
                      name="amountPaid"
                      value={formData.amountPaid}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-tertiary">
                  Register Student
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
