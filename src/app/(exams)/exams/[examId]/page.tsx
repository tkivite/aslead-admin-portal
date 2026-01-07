"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Edit3, Loader2, Calendar, BookOpen, Target, Award } from "lucide-react"
import { toast } from "react-toastify"
import { courseUnitsService } from "@/services/course-units.api"

import ExamModal from "@/app/(administration)/programs/components/exam-modal"
import type { Exam } from "@/types/exams.types"

export default function ExamDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const examId = Number.parseInt(params.examId as string)
  const courseUnitId = Number.parseInt(searchParams.get("courseUnitId") as string)

  const [exam, setExam] = useState<Exam | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
 


  const fetchExam = React.useCallback(async () => {
    if (!courseUnitId || !examId) {
      toast.error("Invalid exam or course unit")
      router.back()
      return
    }

    try {
      setLoading(true)
      const data = await courseUnitsService.getExamById(courseUnitId, examId)
      setExam(data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load exam details")
      router.back()
    } finally {
      setLoading(false)
    }
  }, [courseUnitId, examId, router])

  useEffect(() => {
    fetchExam()
  }, [fetchExam])

  useEffect(() => {
    fetchExam()
  }, [])


  const handleEditSuccess = async () => {
    setIsModalOpen(false)
    await fetchExam()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Exam not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit Exam
            </button>
          </div>
        </div>

     
        {/* Tab Content */}
        <div>
        
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Exam Title Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">{exam.examName}</h1>
                    <div className="flex items-center gap-3 text-gray-600">
                      <BookOpen className="w-5 h-5" />
                      <span className="text-lg">{exam.examType.name}</span>
                    </div>
                    {exam.examType.description && <p className="text-sm text-gray-500">{exam.examType.description}</p>}
                  </div>
                </div>

                {/* Exam Dates & Marks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Exam Date</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {new Date(exam.examDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <Target className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Marks</p>
                        <p className="text-2xl font-bold text-gray-900">{exam.totalMarks}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marks Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Marks Breakdown</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 font-medium mb-2">Passing Marks</p>
                      <p className="text-3xl font-bold text-green-900">{exam.passingMarks}</p>
                      <p className="text-xs text-green-600 mt-1">
                        ({Math.round((exam.passingMarks / exam.totalMarks) * 100)}% required)
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 font-medium mb-2">Pass Rate Threshold</p>
                      <p className="text-3xl font-bold text-blue-900">
                        {Math.round((exam.passingMarks / exam.totalMarks) * 100)}%
                      </p>
                      <p className="text-xs text-blue-600 mt-1">of total marks</p>
                    </div>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Academic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Academic Year</p>
                      <p className="text-lg font-semibold text-gray-900">Year {exam.academicYear}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Session</p>
                      <p className="text-lg font-semibold text-gray-900">Session {exam.session}</p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                {exam.instructions && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Instructions</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{exam.instructions}</p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Course Unit Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Course Unit</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Name</p>
                      <p className="font-semibold text-gray-900">{exam.courseUnit.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Code</p>
                      <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded text-gray-900">
                        {exam.courseUnit.code}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Credit Hours</p>
                      <p className="text-lg font-semibold text-gray-900">{exam.courseUnit.creditHours}</p>
                    </div>
                  </div>
                </div>

                {/* Exam Type Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Exam Type Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Type</p>
                      <p className="font-semibold text-gray-900">{exam.examType.name}</p>
                    </div>
                    {exam.examType.description && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Description</p>
                        <p className="text-sm text-gray-700">{exam.examType.description}</p>
                      </div>
                    )}
                    {exam.examType.weightPercentage && (
                      <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <p className="text-sm text-blue-700">
                          <span className="font-semibold">{exam.examType.weightPercentage}%</span> weight in overall
                          assessment
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Timeline</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <p className="text-gray-500 mb-1">Created</p>
                      <p className="text-gray-900">
                        {exam.createdAt
                          ? new Date(exam.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Last Updated</p>
                      <p className="text-gray-900">
                        {exam.updatedAt
                          ? new Date(exam.updatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        
        </div>
      </div>

      {/* Edit Exam Modal */}
      <ExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleEditSuccess}
        courseUnitId={courseUnitId}
        initialExam={exam}
      />
    </div>
  )
}
