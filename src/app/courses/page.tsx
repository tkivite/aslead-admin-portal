"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Edit,
  Trash,
  Users,
  DollarSign,
  Clock,
  Loader2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { programsService, admissionCyclesService } from "@/services/api"
import { Program } from "@/types/api.types"

interface AdmissionCycle {
  cycleId: number
  program: Program
  startDate: string
  endDate: string
  status: string
  createdAt: string
  updatedAt: string
}



export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddCourseForm, setShowAddCourseForm] = useState(false)
  const [showAddCycleForm, setShowAddCycleForm] = useState(false)
  const [showCyclesView, setShowCyclesView] = useState(false)
  const [editingCourse, setEditingCourse] = useState<number | null>(null)
  const [editingCycle, setEditingCycle] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [programs, setPrograms] = useState<Program[]>([])
  const [admissionCycles, setAdmissionCycles] = useState<AdmissionCycle[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize] = useState(10)

  // Form state for courses
  const [courseForm, setCourseForm] = useState({
    code: "",
    name: "",
    description: "",
    durationMonths: 0,
    tuitionFee: 0,
  })

  // Form state for admission cycles
  const [cycleForm, setCycleForm] = useState({
    programId: "",
    startDate: "",
    endDate: "",
  })

  // Fetch programs
  const fetchPrograms = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await programsService.getPrograms(currentPage, pageSize)
      setPrograms(data.content)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error("Error fetching programs:", err)
      setError( "Failed to load programs")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch admission cycles
  const fetchAdmissionCycles = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await admissionCyclesService.getAdmissionCycles()
      setAdmissionCycles(data.content)
    } catch (err) {
      console.error("Error fetching admission cycles:", err)
      setError( "Failed to load admission cycles")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchPrograms()
  }, [currentPage])

  useEffect(() => {
    if (showCyclesView) {
      fetchAdmissionCycles()
    }
  }, [showCyclesView])

  // Filter programs based on search term
  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter admission cycles based on search term
  const filteredCycles = admissionCycles.filter(
    (cycle) =>
      cycle.program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cycle.program.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cycle.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle edit course
  const handleEditCourse = (courseId: number) => {
    const course = programs.find((p) => p.programId === courseId)
    if (course) {
      setCourseForm({
        code: course.code,
        name: course.name,
        description: course.description,
        durationMonths: course.durationMonths,
        tuitionFee: course.tuitionFee,
      })
      setEditingCourse(courseId)
      setShowAddCourseForm(true)
    }
  }

  // Handle delete course
  const handleDeleteCourse = async (courseId: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        setIsLoading(true)
        await programsService.deleteProgram(courseId)
        await fetchPrograms()
        alert("Course deleted successfully")
      } catch (err) {
        console.error("Error deleting course:", err)
        alert( "Failed to delete course")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Handle edit cycle
  const handleEditCycle = (cycleId: number) => {
    const cycle = admissionCycles.find((c) => c.cycleId === cycleId)
    if (cycle) {
      setCycleForm({
        programId: cycle.program.programId.toString(),
        startDate: cycle.startDate.split(" ")[0], // Extract date part
        endDate: cycle.endDate.split(" ")[0], // Extract date part
      })
      setEditingCycle(cycleId)
      setShowAddCycleForm(true)
    }
  }

  // Handle delete cycle
  const handleDeleteCycle = async (cycleId: number) => {
    if (window.confirm("Are you sure you want to delete this admission cycle?")) {
      try {
        setIsLoading(true)
        await admissionCyclesService.deleteAdmissionCycle(cycleId)
        await fetchAdmissionCycles()
        alert("Admission cycle deleted successfully")
      } catch (err) {
        console.error("Error deleting admission cycle:", err)
        alert( "Failed to delete admission cycle")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Handle course form input change
  const handleCourseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCourseForm({
      ...courseForm,
      [name]: name === "durationMonths" || name === "tuitionFee" ? Number.parseFloat(value) : value,
    })
  }

  // Handle cycle form input change
  const handleCycleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCycleForm({
      ...cycleForm,
      [name]: value,
    })
  }

  // Handle course form submission
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      if (editingCourse) {
        await programsService.updateProgram(editingCourse, courseForm)
        alert("Course updated successfully")
      } else {
        await programsService.createProgram(courseForm)
        alert("Course created successfully")
      }

      // Reset form and close modal
      setCourseForm({
        code: "",
        name: "",
        description: "",
        durationMonths: 0,
        tuitionFee: 0,
      })
      setEditingCourse(null)
      setShowAddCourseForm(false)

      // Refresh programs
      await fetchPrograms()
    } catch (err) {
      console.error("Error saving course:", err)
      alert( "Failed to save course")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle cycle form submission
  const handleCycleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      // Format dates for API
      const formattedStartDate = `${cycleForm.startDate} 00:00:00`
      const formattedEndDate = `${cycleForm.endDate} 00:00:00`

      const cycleData = {
        program: {
          programId: cycleForm.programId,
        },
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      }

      if (editingCycle) {
        await admissionCyclesService.updateAdmissionCycle(editingCycle, cycleData)
        alert("Admission cycle updated successfully")
      } else {
        await admissionCyclesService.createAdmissionCycle(cycleData)
        alert("Admission cycle created successfully")
      }

      // Reset form and close modal
      setCycleForm({
        programId: "",
        startDate: "",
        endDate: "",
      })
      setEditingCycle(null)
      setShowAddCycleForm(false)

      // Refresh admission cycles
      await fetchAdmissionCycles()
    } catch (err) {
      console.error("Error saving admission cycle:", err)
      alert( "Failed to save admission cycle")
    } finally {
      setIsLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <h1 className="text-2xl font-bold text-textDark">{showCyclesView ? "Admission Cycles" : "Courses"}</h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowCyclesView(!showCyclesView)}
            className="btn-secondary flex items-center justify-center"
          >
            {showCyclesView ? (
              <>
                <Users size={18} className="mr-2" />
                View Courses
              </>
            ) : (
              <>
                <CalendarDays size={18} className="mr-2" />
                View Admission Cycles
              </>
            )}
          </button>

          {showCyclesView ? (
            <button
              onClick={() => {
                setEditingCycle(null)
                setCycleForm({
                  programId: "",
                  startDate: "",
                  endDate: "",
                })
                setShowAddCycleForm(true)
              }}
              className="btn-tertiary flex items-center justify-center"
            >
              <Plus size={18} className="mr-2" />
              Add New Cycle
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingCourse(null)
                setCourseForm({
                  code: "",
                  name: "",
                  description: "",
                  durationMonths: 0,
                  tuitionFee: 0,
                })
                setShowAddCourseForm(true)
              }}
              className="btn-tertiary flex items-center justify-center"
            >
              <Plus size={18} className="mr-2" />
              Add New Course
            </button>
          )}
        </div>
      </motion.div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="relative mb-6">
          <input
            type="text"
            placeholder={showCyclesView ? "Search admission cycles..." : "Search courses..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 size={40} className="animate-spin text-tertiary" />
          </div>
        ) : showCyclesView ? (
          // Admission Cycles View
          admissionCycles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No admission cycles found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-backgroundsecondary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textDark uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCycles.map((cycle, index) => (
                    <motion.tr
                      key={cycle.cycleId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-backgroundsecondary"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-textDark">{cycle.program.name}</div>
                        <div className="text-xs text-gray-500">{cycle.program.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">
                        {formatDate(cycle.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">{formatDate(cycle.endDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            cycle.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : cycle.status === "IN_REVIEW"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {cycle.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">
                        {formatDate(cycle.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textDark">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCycle(cycle.cycleId)}
                            className="text-tertiary hover:text-primary transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteCycle(cycle.cycleId)}
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
          )
        ) : // Courses View
        programs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program.programId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="h-2 bg-tertiary"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-textDark">{program.name}</h3>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {program.code}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{program.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2 text-tertiary" />
                      {program.durationMonths} months
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign size={16} className="mr-2 text-tertiary" />Ksh. {program.tuitionFee}
                    </div>
                    {program.costs && program.costs.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Additional Costs:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {program.costs.map((cost) => (
                            <li key={cost.costId}>
                              {cost.description}: Ksh. {cost.amount}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEditCourse(program.programId)}
                      className="p-2 text-tertiary hover:text-primary transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(program.programId)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!showCyclesView && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, programs.length)} of{" "}
              {programs.length} courses
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
        )}
      </motion.div>

      {/* Add/Edit Course Modal */}
      {showAddCourseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">{editingCourse ? "Edit Course" : "Add New Course"}</h2>
            </div>
            <form onSubmit={handleCourseSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-textDark mb-1">Course Name</label>
                  <input
                    type="text"
                    name="name"
                    value={courseForm.name}
                    onChange={handleCourseInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Course Code</label>
                  <input
                    type="text"
                    name="code"
                    value={courseForm.code}
                    onChange={handleCourseInputChange}
                    placeholder="e.g. CS-2024"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Duration (months)</label>
                  <input
                    type="number"
                    name="durationMonths"
                    value={courseForm.durationMonths}
                    onChange={handleCourseInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-textDark mb-1">Description</label>
                  <textarea
                    name="description"
                    value={courseForm.description}
                    onChange={handleCourseInputChange}
                    className="input-field min-h-[100px]"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Tuition Fee (Ksh)</label>
                  <input
                    type="number"
                    name="tuitionFee"
                    value={courseForm.tuitionFee}
                    onChange={handleCourseInputChange}
                    step="0.01"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddCourseForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="btn-tertiary">
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-1" /> {editingCourse ? "Updating..." : "Adding..."}
                    </>
                  ) : editingCourse ? (
                    "Update Course"
                  ) : (
                    "Add Course"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add/Edit Admission Cycle Modal */}
      {showAddCycleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                {editingCycle ? "Edit Admission Cycle" : "Add New Admission Cycle"}
              </h2>
            </div>
            <form onSubmit={handleCycleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-textDark mb-1">Program</label>
                  <select
                    name="programId"
                    value={cycleForm.programId}
                    onChange={handleCycleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Program</option>
                    {programs.map((program) => (
                      <option key={program.programId} value={program.programId}>
                        {program.name} ({program.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={cycleForm.startDate}
                    onChange={handleCycleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={cycleForm.endDate}
                    onChange={handleCycleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddCycleForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="btn-tertiary">
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-1" /> {editingCycle ? "Updating..." : "Adding..."}
                    </>
                  ) : editingCycle ? (
                    "Update Cycle"
                  ) : (
                    "Add Cycle"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
