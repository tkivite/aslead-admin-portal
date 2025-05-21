"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Mail,
  Phone,
  Flag,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { applicationsService } from "@/services/api"
import type { Application } from "@/types/api.types"




export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProgram, setSelectedProgram] = useState("All Programs")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(0) // API uses 0-based indexing
  const [pageSize] = useState(10)
  const [applications, setApplications] = useState<Application[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [programs, setPrograms] = useState<string[]>([])
  const [applicationStatuses] = useState(["All Statuses", "DRAFT", "PENDING", "APPROVED", "REJECTED"])

  // Fetch applications
  const fetchApplications = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await applicationsService.getApplications(currentPage, pageSize)
      setApplications(data.content)
      setTotalPages(data.totalPages)

      // Extract unique program names for filtering
      const uniquePrograms:string[] = Array.from(
        new Set(data.content.map((app: Application) => app.program?.name).filter(Boolean)),
      )
      setPrograms(["All Programs", ...uniquePrograms])
    } catch (err) {
      console.error("Error fetching applications:", err)
      setError( "Failed to load applications")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchApplications()
  }, [currentPage, pageSize])

  // Filter applications based on search term and filters
  const filteredApplications = applications.filter((application) => {
    const fullName = `${application.applicant.firstName} ${application.applicant.lastName}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      application.applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.applicant.mobile.includes(searchTerm)

    const matchesProgram = selectedProgram === "All Programs" || application.program?.name === selectedProgram

    const matchesStatus = selectedStatus === "All Statuses" || application.status === selectedStatus

    const appDate = new Date(application.submittedAt)
    const matchesDateRange =
      (!startDate || appDate >= new Date(startDate)) && (!endDate || appDate <= new Date(endDate))

    return matchesSearch && matchesProgram && matchesStatus && matchesDateRange
  })

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Approved
          </span>
        )
      case "REJECTED":
        return (
          <span className="flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Rejected
          </span>
        )
      case "DRAFT":
        return (
          <span className="flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            <Clock size={12} className="mr-1" />
            Draft
          </span>
        )
      case "PENDING":
      default:
        return (
          <span className="flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        )
    }
  }

  // Handle view application
  const handleViewApplication = (applicationId: number) => {
    setSelectedApplication(applicationId)
  }

  // Handle approve application
  const handleApproveApplication = async (applicantId: number) => {
    try {
      setIsLoading(true)
      // Format current date for API
      const now = new Date()
      const enrolledAt = now.toISOString().replace("T", " ").substring(0, 19)

      await applicationsService.approveApplication(applicantId, "ENROLLED", enrolledAt)

      // Refresh applications
      await fetchApplications()

      setSelectedApplication(null)
      alert("Application approved successfully")
    } catch (err) {
      console.error("Error approving application:", err)
      alert( "Failed to approve application")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle reject application
  const handleRejectApplication = async (applicantId: number) => {
    try {
      setIsLoading(true)
      // Format current date for API
      const now = new Date()
      const enrolledAt = now.toISOString().replace("T", " ").substring(0, 19)

      await applicationsService.approveApplication(applicantId, "REJECTED", enrolledAt)

      // Refresh applications
      await fetchApplications()

      setSelectedApplication(null)
      alert("Application rejected successfully")
    } catch (err) {
      console.error("Error rejecting application:", err)
      alert("Failed to reject application")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle export data
  const handleExportData = () => {
    // Convert applications to CSV
    const headers = [
      "Application ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Program",
      "Status",
      "Submitted Date",
    ]

    const csvData = filteredApplications.map((app) => [
      app.applicationId,
      app.applicant.firstName,
      app.applicant.lastName,
      app.applicant.email,
      app.applicant.mobile,
      app.program?.name || "N/A",
      app.status,
      app.submittedAt,
    ])

    const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n")

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `applications_export_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <h1 className="text-2xl font-bold text-textDark">Student Applications</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleExportData} className="btn-secondary flex items-center justify-center">
            <Download size={18} className="mr-2" />
            Export Data
          </button>
        </div>
      </motion.div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Program</label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="input-field"
              >
                {programs.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
              >
                {applicationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "All Statuses" ? status : status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textDark mb-1">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 size={40} className="animate-spin text-tertiary" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-backgroundsecondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                    Submitted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                    Fee Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application, index) => (
                  <motion.tr
                    key={application.applicationId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-backgroundsecondary"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-textDark">
                        {application.applicant.firstName} {application.applicant.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{application.applicant.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">
                      {application.program?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          application.feePaymentStatus === "PAID"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {application.feePaymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(application.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">
                      <button
                        onClick={() => handleViewApplication(application.applicationId)}
                        className="flex items-center text-tertiary hover:text-primary transition-colors"
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, applications.length)} of{" "}
            {applications.length} applications
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="p-2 rounded-md bg-backgroundsecondary hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm">
              Page {currentPage + 1} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1 || totalPages === 0}
              className="p-2 rounded-md bg-backgroundsecondary hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Application Details Modal */}
      {selectedApplication !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {(() => {
              const application = applications.find((app) => app.applicationId === selectedApplication)
              if (!application) return null

              return (
                <>
                  <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Application Details</h2>
                      <div className="flex items-center space-x-2">
                        {application.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApproveApplication(application.applicant.applicantId)}
                              disabled={isLoading}
                              className="btn-tertiary flex items-center"
                            >
                              {isLoading ? (
                                <Loader2 size={16} className="animate-spin mr-1" />
                              ) : (
                                <CheckCircle size={16} className="mr-1" />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectApplication(application.applicant.applicantId)}
                              disabled={isLoading}
                              className="btn-accent flex items-center"
                            >
                              {isLoading ? (
                                <Loader2 size={16} className="animate-spin mr-1" />
                              ) : (
                                <XCircle size={16} className="mr-1" />
                              )}
                              Reject
                            </button>
                          </>
                        )}
                      
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-500 mr-2">Status:</span>
                      {getStatusBadge(application.status)}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Applicant Information</h3>
                        <div className="bg-backgroundsecondary rounded-lg p-4 space-y-3">
                          <div className="flex items-start">
                            <User size={18} className="text-tertiary mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Full Name</p>
                              <p className="text-sm">
                                {application.applicant.firstName} {application.applicant.lastName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Mail size={18} className="text-tertiary mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Email</p>
                              <p className="text-sm">{application.applicant.email}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Phone size={18} className="text-tertiary mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Phone</p>
                              <p className="text-sm">{application.applicant.mobile}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Calendar size={18} className="text-tertiary mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Date of Birth</p>
                              <p className="text-sm">{application.applicant.dob}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Flag size={18} className="text-tertiary mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Citizenship</p>
                              <p className="text-sm">{application.applicant.citizenship}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <BookOpen size={18} className="text-tertiary mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Education Level</p>
                              <p className="text-sm">{application.applicant.currentEducationLevel}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Program Information</h3>
                        <div className="bg-backgroundsecondary rounded-lg p-4 space-y-3">
                          <div>
                            <p className="text-sm font-medium">Program</p>
                            <p className="text-sm">{application.program?.name || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Program Code</p>
                            <p className="text-sm">{application.program?.code || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Description</p>
                            <p className="text-sm">{application.program?.description || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Duration</p>
                            <p className="text-sm">{application.program?.durationMonths || "N/A"} months</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Tuition Fee</p>
                            <p className="text-sm">Ksh. {application.program?.tuitionFee || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Submitted Date</p>
                            <p className="text-sm">{new Date(application.submittedAt).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Fee Payment Status</p>
                            <p className="text-sm">{application.feePaymentStatus}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      {application.status === "PENDING"|| application.status === "DRAFT" && (
                        <>
                          <button
                            onClick={() => handleApproveApplication(application.applicant.applicantId)}
                            disabled={isLoading}
                            className="btn-tertiary flex items-center"
                          >
                            {isLoading ? (
                              <Loader2 size={16} className="animate-spin mr-1" />
                            ) : (
                              <CheckCircle size={16} className="mr-1" />
                            )}
                            Approve Application
                          </button>
                          <button
                            onClick={() => handleRejectApplication(application.applicant.applicantId)}
                            disabled={isLoading}
                            className="btn-accent flex items-center"
                          >
                            {isLoading ? (
                              <Loader2 size={16} className="animate-spin mr-1" />
                            ) : (
                              <XCircle size={16} className="mr-1" />
                            )}
                            Reject Application
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedApplication(null)}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </>
              )
            })()}
          </motion.div>
        </div>
      )}
    </div>
  )
}
