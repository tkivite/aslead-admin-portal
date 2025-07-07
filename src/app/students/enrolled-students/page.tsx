"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, User, Phone, Mail, GraduationCap } from "lucide-react"
import DataTable from "@/app/components/common/DataTable"
import type { Student } from "@/types/students.types"
import { exportStudentsToCSV } from "@/utils/csvExport"
import DocumentsViewer from "@/app/components/common/DocumentsViewer"
import { studentsService } from "@/services/students.api"

export default function EnrolledStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  useEffect(() => {
    fetchStudents()
  }, [currentPage])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await studentsService.getPaginatedStudents(currentPage, 10, "ENROLLED")
      setStudents(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error("Error fetching enrolled students:", error)
    } finally {
      setLoading(false)
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
      label: "Student",
      render: (student: Student) => (
        <div>
          <div className="text-sm font-medium text-textDark">
            {student.applicant.firstName} {student.applicant.lastName}
          </div>
          <div className="text-xs text-gray-500">{student.applicant.email}</div>
        </div>
      ),
    },
    {
      key: "program",
      label: "Program",
      render: (student: Student) => (
        <div>
          <div className="text-sm font-medium text-textDark">{student.application.program.code}</div>
          <div className="text-xs text-gray-500">{student.application.program.name}</div>
        </div>
      ),
    },
    {
      key: "campus",
      label: "Campus",
      render: (student: Student) => <span className="text-sm text-gray-600">{student.application.campus.name}</span>,
    },
    {
      key: "enrollmentStatus",
      label: "Status",
      render: (student: Student) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-tertiary/10 text-tertiary">
          {student.enrollmentStatus}
        </span>
      ),
    },
    {
      key: "enrolledAt",
      label: "Enrolled",
      render: (student: Student) => <span className="text-sm text-gray-600">{formatDate(student.enrolledAt)}</span>,
    },
  ]

  const expandableRow = (student: Student) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <User className="h-4 w-4" />
          Personal Details
        </h4>
        <div className="text-sm space-y-1">
          <p className="flex items-center gap-2">
            <Phone className="h-3 w-3" />
            <span className="font-medium">Mobile:</span> {student.applicant.mobile}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-3 w-3" />
            <span className="font-medium">Email:</span> {student.applicant.email}
          </p>
          <p>
            <span className="font-medium">DOB:</span> {formatDate(student.applicant.dob)}
          </p>
          <p>
            <span className="font-medium">Education:</span> {student.applicant.currentEducationLevel}
          </p>
          <p>
            <span className="font-medium">Citizenship:</span> {student.applicant.citizenship}
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
            <span className="font-medium">Duration:</span> {student.application.program.durationMonths} months
          </p>
          <p>
            <span className="font-medium">Tuition:</span> KES {student.application.program.tuitionFee.toLocaleString()}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span className="font-medium">Campus:</span> {student.application.campus.location}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-textDark flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Enrollment Info
        </h4>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Student ID:</span> {student.studentId}
          </p>
          <p>
            <span className="font-medium">Enrolled:</span> {formatDate(student.enrolledAt)}
          </p>
          <p>
            <span className="font-medium">Application:</span> {formatDate(student.application.submittedAt)}
          </p>
          <p>
            <span className="font-medium">Fee Status:</span>
            <span
              className={`ml-2 px-2 py-1 text-xs rounded-full ${
                student?.application?.feePaymentStatus === "PAID"
                  ? "bg-tertiary/10 text-tertiary"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {student?.application?.feePaymentStatus?.replace("_", " ")}
            </span>
          </p>
        </div>
         <div className="space-y-2">
        <DocumentsViewer
          applicantId={student?.applicant?.applicantId}
          applicantName={`${student?.applicant?.firstName} ${student?.applicant?.lastName}`}
        />
      </div>
      </div>
    </div>
  )

  const handleExport = () => {
    exportStudentsToCSV(students)
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-textDark mb-2">Enrolled Students</h1>
        <p className="text-gray-600">Manage currently enrolled students</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <DataTable
          data={students}
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
          title={`Enrolled Students (${totalElements})`}
        />
      </motion.div>
    </div>
  )
}
