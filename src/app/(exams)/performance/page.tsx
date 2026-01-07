"use client"

import React, { useEffect, useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import DataTable from "@/app/components/common/DataTable"

import { programsService } from "@/services/programs.api"
import { courseUnitsService } from "@/services/course-units.api"
import { examsService } from "@/services/exams.api"
import AddMarksModal from "@/app/(exams)/exams/components/add-marks-modal"
import SearchableSelect from "@/app/components/common/SearchableSelect"
import type { Program } from "@/types/programs.types"
import type { CourseUnit } from "@/types/courses.types"
import type { Exam, ExamMark } from "@/types/exams.types"

export default function PerformancePage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null)
  const [units, setUnits] = useState<CourseUnit[]>([])
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null)
  const [exams, setExams] = useState<Exam[]>([])
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null)

  const [stats, setStats] = useState<{ averageMarks?: number; highestMarks?: number; lowestMarks?: number } | null>(null)
  const [marksData, setMarksData] = useState<{ content: ExamMark[]; totalPages: number; totalElements: number }>({ content: [], totalPages: 1, totalElements: 0 })
  const [marksPage, setMarksPage] = useState(0)
  const [marksLoading, setMarksLoading] = useState(false)

  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const p = await programsService.getPrograms()
        setPrograms(p)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load programs")
      }
    }
    loadPrograms()
  }, [])

  // Load units when program is selected
  useEffect(() => {
    if (!selectedProgramId) return
    const loadUnits = async () => {
      try {
        const u = await courseUnitsService.getCourseUnits(selectedProgramId)
        setUnits(u)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load units")
      }
    }
    loadUnits()
  }, [selectedProgramId])

  // Accept pre-filled values from query params to support navigation from exam detail page
  const searchParams = useSearchParams()

  useEffect(() => {
    const programIdFromQ = searchParams.get("programId")
    const unitIdFromQ = searchParams.get("unitId")
    const examIdFromQ = searchParams.get("examId")

    if (programIdFromQ) {
      const pid = parseInt(programIdFromQ)
      setSelectedProgramId(pid)
    }

    if (unitIdFromQ) {
      setSelectedUnitId(unitIdFromQ ? parseInt(unitIdFromQ) : null)
    }

    if (examIdFromQ) {
      setSelectedExamId(examIdFromQ ? parseInt(examIdFromQ) : null)
    }
  }, [searchParams])

  useEffect(() => {
    if (!selectedUnitId) return
    const loadExams = async () => {
      try {
        const data = await courseUnitsService.getExams(selectedUnitId)
        setExams(data.content)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load exams")
      }
    }
    loadExams()
  }, [selectedUnitId])

  useEffect(() => {
    if (!selectedExamId) return

    const fetchStats = async () => {
      try {
        const s = await examsService.getStatistics(selectedExamId)
        setStats(s)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load statistics")
      }
    }

    const fetchMarks = async (page = 0) => {
      try {
        setMarksLoading(true)
        const m = await examsService.getMarks(selectedExamId, page, 10)
        setMarksData(m)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load marks")
      } finally {
        setMarksLoading(false)
      }
    }

    fetchStats()
    fetchMarks(marksPage)
  }, [selectedExamId, marksPage])

  const handleAddSuccess = async () => {
    // Refresh marks for current page
    if (selectedExamId) {
      const d = await examsService.getMarks(selectedExamId, marksPage, 10) as typeof marksData
      setMarksData(d)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Performance</h1>
          <p className="text-gray-600 mt-1">View and manage student performance across programs, units and exams</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
              <SearchableSelect
                options={programs.map((p) => ({ value: p.programId, label: `${p.name} - ${p.code}` }))}
                value={selectedProgramId}
                onChange={(v: string | number | null) => {
                  const id = v ? Number(v) : null
                  setSelectedProgramId(id)
                  setSelectedUnitId(null)
                  setUnits([])
                  setExams([])
                  setSelectedExamId(null)
                }}
                placeholder="Select program"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <SearchableSelect
                options={units.map((u) => ({ value: u.unitId, label: u.name }))}
                value={selectedUnitId}
                onChange={(v: string | number | null) => setSelectedUnitId(v ? Number(v) : null)}
                placeholder="Select unit"
                className="w-full"
                disabled={!selectedProgramId}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
              <SearchableSelect
                options={exams.map((ex) => ({ value: ex.examId, label: ex.examName }))}
                value={selectedExamId}
                onChange={(v: string | number | null) => setSelectedExamId(v ? Number(v) : null)}
                placeholder="Select exam"
                className="w-full"
                disabled={!selectedUnitId}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowAddModal(true)}
                disabled={!selectedExamId}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Marks
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Average Marks</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.averageMarks && exams?.length>0 ? stats?.averageMarks : "-"}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Highest Marks</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.highestMarks && exams?.length>0 ? stats?.highestMarks : "-"}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600">Lowest Marks</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.lowestMarks && exams?.length>0 ? stats?.lowestMarks : "-"}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Student Marks</h3>
            </div>

           

            {marksLoading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable
                loading={marksLoading}
                data={marksData?.content && exams?.length>0 ? marksData?.content : []}
                searchable={false}
                pagination={{
                  currentPage: marksPage,
                  totalPages: marksData.totalPages || 1,
                  totalElements: marksData.totalElements || 0,
                  onPageChange: (p: number) => setMarksPage(p),
                }}
                columns={[
                  {
                    key: "student",
                    label: "Student",
                    render: (item: ExamMark) => {
                      const applicant = item.student?.applicant || item.student?.application?.applicant
                      if (applicant) return `${applicant.firstName} ${applicant.lastName}`
                      return item.student?.enrollmentNumber || item.student?.admissionNumber || "-"
                    },
                  },
                  { key: "marksObtained", label: "Marks", render: (item: ExamMark) => item.marksObtained },
                  { key: "grade", label: "Grade" },
                  { key: "remarks", label: "Remarks" },
                  { key: "markedBy", label: "Marked By" },
                  {
                    key: "markedAt",
                    label: "Marked At",
                    render: (item: ExamMark) => (item.markedAt ? new Date(item.markedAt).toLocaleString() : "-"),
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>

      <AddMarksModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        examId={selectedExamId ?? 0}
        programId={selectedProgramId}
        unitId={selectedUnitId}
      />
    </div>
  )
}
