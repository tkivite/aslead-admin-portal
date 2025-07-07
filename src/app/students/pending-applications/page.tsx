"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, CreditCard, MapPin, User, Phone, Mail, GraduationCap, Check} from "lucide-react"
import DataTable from "@/app/components/common/DataTable"
import type { Application } from "@/types/applications.types"
import { exportApplicationsToCSV } from "@/utils/csvExport"
import { applicationsService } from "@/services/applications.api"
import DocumentsViewer from "@/app/components/common/DocumentsViewer"

export default function PendingApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [approvingIds, setApprovingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchApplications()
  }, [currentPage])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await applicationsService.getPaginatedApplications(currentPage, 10, "PENDING")
      setApplications(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error("Error fetching pending applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveApplication = async (application: Application) => {
    try {
      setApprovingIds((prev) => new Set(prev).add(application.applicationId))

      await applicationsService.approveApplication(application.applicant.applicantId, application.applicationId)

      // Remove the approved application from the current list
      setApplications((prev) => prev.filter((app) => app.applicationId !== application.applicationId))

      // Update total elements count
      setTotalElements((prev) => prev - 1)

      // If current page becomes empty and it's not the first page, go to previous page
      if (applications.length === 1 && currentPage > 0) {
        setCurrentPage((prev) => prev - 1)
      } else {
        // Refresh the current page to get updated data
        fetchApplications()
      }
    } catch (error) {
      console.error("Error approving application:", error)
    
    } finally {
      setApprovingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(application.applicationId)
        return newSet
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const columns = [
    {
      key: "applicant",
      label: "Applicant",
      render: (app: Application) => (
        <div>
          <div className="text-sm font-medium text-textDark">
            {app.applicant.firstName} {app.applicant.lastName}
          </div>
          <div className="text-xs text-gray-500">{app.applicant.email}</div>
        </div>
      ),
    },
    {
      key: "program",
      label: "Program",
      render: (app: Application) => (
        <div>
          <div className="text-sm font-medium text-textDark">{app.program.code}</div>
          <div className="text-xs text-gray-500">{app.program.name}</div>
        </div>
      ),
    },
    {
      key: "campus",
      label: "Campus",
      render: (app: Application) => <span className="text-sm text-gray-600">{app.campus.name}</span>,
    },
    {
      key: "feeAmount",
      label: "Fee Amount",
      render: (app: Application) => (
        <span className="text-sm font-medium text-tertiary">KES {app.feeAmount.toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (app: Application) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-accent/10 text-accent">
          {app.status}
        </span>
      ),
    },
    {
      key: "submittedAt",
      label: "Submitted",
      render: (app: Application) => <span className="text-sm text-gray-600">{formatDate(app.submittedAt)}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (app: Application) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleApproveApplication(app)
            }}
            disabled={approvingIds.has(app.applicationId)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {approvingIds.has(app.applicationId) ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Approving...
              </>
            ) : (
              <>
                <Check className="w-3 h-3" />
                Approve
              </>
            )}
          </button>
       
        </div>
      ),
    },
  ]

  const expandableRow = (app: Application) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <User className="h-4 w-4" />
          Personal Details
        </h4>
        <div className="text-sm space-y-1">
          <p className="flex items-center gap-2">
            <Phone className="h-3 w-3" />
            <span className="font-medium">Mobile:</span> {app.applicant.mobile}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-3 w-3" />
            <span className="font-medium">Email:</span> {app.applicant.email}
          </p>
          <p>
            <span className="font-medium">DOB:</span> {formatDate(app.applicant.dob)}
          </p>
          <p>
            <span className="font-medium">Education:</span> {app.applicant.currentEducationLevel}
          </p>
          <p>
            <span className="font-medium">Citizenship:</span> {app.applicant.citizenship}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Program Details
        </h4>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Duration:</span> {app.program.durationMonths} months
          </p>
          <p>
            <span className="font-medium">Tuition:</span> KES {app.program.tuitionFee.toLocaleString()}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span className="font-medium">Campus:</span> {app.campus.location}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Status
        </h4>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Fee Status:</span>
            <span
              className={`ml-2 px-2 py-1 text-xs rounded-full ${
                app?.feePaymentStatus === "PAID" ? "bg-tertiary/10 text-tertiary" : "bg-red-100 text-red-600"
              }`}
            >
              {app?.feePaymentStatus.replace("_", " ")}
            </span>
          </p>
          <p>
            <span className="font-medium">Reference:</span> {app.paymentReference || "N/A"}
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span className="font-medium">Applied:</span> {formatDate(app.createdAt)}
          </p>
        </div>
      </div>
     
      <div className="space-y-2">
        <DocumentsViewer
          applicantId={app?.applicant?.applicantId}
          applicantName={`${app.applicant?.firstName} ${app?.applicant?.lastName}`}
        />
      </div>
    </div>
  )

  const handleExport = () => {
    exportApplicationsToCSV(applications)
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-textDark mb-2">Pending Applications</h1>
        <p className="text-gray-600">Manage and review pending student applications</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <DataTable
          data={applications}
          columns={columns}
          loading={loading}
          expandableRow={expandableRow}
          pagination={{
            currentPage,
            totalPages,
            totalElements,
            onPageChange: setCurrentPage,
          }}
          onExport={handleExport}
          title={`Pending Applications (${totalElements})`}
        />
      </motion.div>
    </div>
  )
}
