"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { studentsService } from "@/services/students.api"
import { examsService } from "@/services/exams.api"
import SearchableSelect from "@/app/components/common/SearchableSelect"
import type { Student } from "@/types/students.types"

interface AddMarksModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  examId: number
  programId?: number | null
  unitId?: number | null
}

export default function AddMarksModal({ isOpen, onClose, onSuccess, examId, programId }: AddMarksModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)

  const [form, setForm] = useState({ studentId: 0, marksObtained: "", remarks: "", markedBy: "" })

  useEffect(() => {
    if (!isOpen) return
    const loadStudents = async () => {
      try {
        setLoadingStudents(true)
        // Fetch enrolled students for the selected program
        const resp = await studentsService.getPaginatedStudents(0, 1000, "ENROLLED", {
          programId: programId ?? undefined,
        })
        setStudents(resp.content || [])
      } catch (err) {
        console.error(err)
        toast.error("Failed to load students")
      } finally {
        setLoadingStudents(false)
      }
    }
    loadStudents()
  }, [isOpen, programId])

  useEffect(() => {
    if (!isOpen) return
    setForm({ studentId: 0, marksObtained: "", remarks: "", markedBy: "" })
  }, [isOpen])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!form.studentId || !examId) {
      toast.error("Please select a student and provide marks")
      return
    }

    setSubmitting(true)
    try {
      await examsService.addMark(examId, {
        student: { studentId: form.studentId },
        marksObtained: Number(form.marksObtained),
        remarks: form.remarks,
        markedBy: form.markedBy,
      })
      toast.success("Marks added successfully")
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error("Failed to add marks. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-xl p-6 bg-white rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add Marks</h3>
              <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                <SearchableSelect
                  options={students.map((s) => ({ value: s.studentId, label: `${s.applicant.firstName} ${s.applicant.lastName}`, meta: s.admissionNumber }))}
                  value={form.studentId}
                  onChange={(v: string | number | null) => setForm((s) => ({ ...s, studentId: v ? Number(v) : 0 }))}
                  placeholder="Select student"
                  className="w-full"
                />
                {loadingStudents && <p className="text-xs text-gray-500 mt-1">Loading students...</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marks Obtained *</label>
                <input
                  type="text"
                  value={form.marksObtained}
                  onChange={(e) => setForm((s) => ({ ...s, marksObtained:(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <input
                  type="text"
                  value={form.remarks}
                  onChange={(e) => setForm((s) => ({ ...s, remarks: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marked By</label>
                <input
                  type="text"
                  value={form.markedBy}
                  onChange={(e) => setForm((s) => ({ ...s, markedBy: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Add Marks"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
