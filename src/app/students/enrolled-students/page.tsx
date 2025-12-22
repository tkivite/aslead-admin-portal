"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, User, Phone, Mail, GraduationCap, Edit } from "lucide-react"
import DataTable from "@/app/components/common/DataTable"
import TableFilters, { FilterOptions } from "@/app/components/common/TableFilters"

import type { Student,  Campus } from "@/types/students.types"
import type { Program } from "@/types/programs.types"
import { exportStudentsToCSV } from "@/utils/csvExport"
import DocumentsViewer from "@/app/components/common/DocumentsViewer"
import DocumentsEditor from "@/app/components/common/DocumentsEditor"
import { studentsService } from "@/services/students.api"
import EditStudentModal from "../components/edit-student-modal"

export default function EnrolledStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [filters, setFilters] = useState<FilterOptions>({})
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [docEditorOpen, setDocEditorOpen] = useState(false)
  const [docEditorStudent, setDocEditorStudent] = useState<Student | null>(null)
  const [programs, setPrograms] = useState<Program[]>([])
  const [campuses, setCampuses] = useState<Campus[]>([])

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true)
      const response = await studentsService.getPaginatedStudents(currentPage, 10, "ENROLLED", filters)
      setStudents(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error("Error fetching enrolled students:", error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, filters])

  useEffect(() => {
    fetchStudents()
    fetchProgramsAndCampuses()
  }, [fetchStudents])

  const fetchProgramsAndCampuses = async () => {
    try {
      const [programsData, campusesData] = await Promise.all([
        studentsService.getPrograms(),
        studentsService.getCampuses(),
      ])
      setPrograms(programsData)
      setCampuses(campusesData)
    } catch (error) {
      console.error("Error fetching programs and campuses:", error)
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
            {student.applicant.firstName} {student.applicant.middleName} {student.applicant.lastName}
          </div>
          <div className="text-xs text-gray-500">{student.admissionNumber}</div>
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
    {
      key: "actions",
      label: "Actions",
      render: (student: Student) => (
        <button
          onClick={() => handleEditClick(student)}
          className="flex items-center gap-1 px-2 py-1 text-sm text-primary hover:text-primary/80 hover:bg-primary/10 rounded transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      ),
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
            applicantName={`${student?.applicant?.firstName} ${student?.applicant?.middleName} ${student?.applicant?.lastName}`}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setDocEditorStudent(student)
                setDocEditorOpen(true)
              }}
              className="px-3 py-1 text-xs bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Edit Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const handleExport = () => {
    exportStudentsToCSV(students)
  }

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student)
    setIsEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    fetchStudents()
    setIsEditModalOpen(false)
    setSelectedStudent(null)
  }

  return (
    <div className="p-6 space-y-6 relative">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-textDark mb-2">Enrolled Students</h1>
            <p className="text-gray-600">Manage currently enrolled students</p>
          </div>
       
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <TableFilters
          onFiltersChange={setFilters}
          showEnrollmentStatusFilter={false}
          showDateRangeFilter={true}
          showSearchFilter={true}
          showSortFilter={true}
          showCampusFilter={true}
          showProgramFilter={true}
          enrollmentStatusOptions={[
            { value: "ENROLLED", label: "Enrolled" },
            { value: "COMPLETED", label: "Completed" },
            { value: "DROPPED", label: "Dropped" },
          ]}
          campusOptions={campuses.map(campus => ({
            value: campus.id,
            label: `${campus.name} - ${campus.location}`
          }))}
          programOptions={programs.map(program => ({
            value: program.programId,
            label: `${program.name} - ${program.code}`
          }))}
          sortOptions={[
            { value: "createdAt", label: "Created Date" },
            { value: "enrolledAt", label: "Enrolled Date" },
            { value: "applicant.firstName", label: "First Name" },
            { value: "applicant.lastName", label: "Last Name" },
          ]}
        />
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

      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedStudent(null)
        }}
        onSuccess={handleEditSuccess}
        student={selectedStudent}
      />

      <DocumentsEditor
        isOpen={docEditorOpen}
        onClose={() => {
          setDocEditorOpen(false)
          setDocEditorStudent(null)
        }}
        onSuccess={() => {
          fetchStudents()
          setDocEditorOpen(false)
          setDocEditorStudent(null)
        }}
        applicantId={docEditorStudent?.applicant?.applicantId ?? 0}
        applicationId={docEditorStudent?.application?.applicationId ?? 0}
        applicantInfo={docEditorStudent?.applicant}
        programId={docEditorStudent?.application?.program?.programId ?? 0}
        campusId={docEditorStudent?.application?.campus?.id ?? 0}
        paymentReference={docEditorStudent?.application?.paymentReference}
      />
    </div>
  )
}
