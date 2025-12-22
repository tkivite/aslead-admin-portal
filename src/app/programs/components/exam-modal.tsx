"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { examTypesService } from "@/services/exam-types.api";
import { courseUnitsService } from "@/services/course-units.api";
import type { Exam, ExamCreateRequest } from "@/types/exams.types";

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  courseUnitId: number;
  initialExam?: Exam | null;
}

export default function ExamModal({ isOpen, onClose, onSuccess, courseUnitId, initialExam = null }: ExamModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [examTypes, setExamTypes] = useState<Array<{ examTypeId: number; name: string }>>([]);

  const [form, setForm] = useState<ExamCreateRequest>({
    examType: { examTypeId: 1 },
    examName: "",
    examDate: "",
    totalMarks: 100,
    passingMarks: 40,
    academicYear: 1,
    session: 1,
    instructions: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const types = await examTypesService.getExamTypes();
        setExamTypes(types.map((t) => ({ examTypeId: t.examTypeId, name: t.name })));
        if (types.length > 0) {
          setForm((s) => {
            if (!s.examType) {
              return { ...s, examType: { examTypeId: types[0].examTypeId } };
            }
            return s;
          });
        }
      } catch (err) {
        console.error("Failed to load exam types", err);
      }
    };
    if (isOpen) load();
  }, [isOpen]);

  useEffect(() => {
    if (initialExam) {
      setForm({
        examType: { examTypeId: initialExam.examType.examTypeId },
        examName: initialExam.examName,
        examDate: initialExam.examDate,
        totalMarks: initialExam.totalMarks,
        passingMarks: initialExam.passingMarks,
        academicYear: initialExam.academicYear,
        session: initialExam.session,
        instructions: initialExam.instructions || "",
      });
    } else {
      setForm((s) => ({ ...s }));
    }
  }, [initialExam, isOpen]);

  const handleChange = (key: keyof ExamCreateRequest, value: string | number | { examTypeId: number }) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!form.examName || !form.examDate) {
      toast.error("Please provide exam name and date");
      return;
    }

    setSubmitting(true);
    try {
      if (initialExam) {
        await courseUnitsService.updateExam(courseUnitId, initialExam.examId, form);
        toast.success("Exam updated successfully");
      } else {
        await courseUnitsService.createExam(courseUnitId, form);
        toast.success("Exam created successfully");
      }
      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
   
    onClose();
  };

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
            className="relative z-10 w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{initialExam ? "Edit Exam" : "Create Exam"}</h3>
              <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type *</label>
                  <select
                    value={form.examType.examTypeId}
                    onChange={(e) => handleChange("examType", { examTypeId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {examTypes.map((t) => (
                      <option key={t.examTypeId} value={t.examTypeId}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name *</label>
                  <input
                    type="text"
                    value={form.examName}
                    onChange={(e) => handleChange("examName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date *</label>
                  <input
                    type="date"
                    value={form.examDate}
                    onChange={(e) => handleChange("examDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks *</label>
                  <input
                    type="number"
                    value={form.totalMarks}
                    onChange={(e) => handleChange("totalMarks", parseFloat(e.target.value || "0"))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks *</label>
                  <input
                    type="number"
                    value={form.passingMarks}
                    onChange={(e) => handleChange("passingMarks", parseFloat(e.target.value || "0"))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
                  <select
                    value={form.academicYear}
                    onChange={(e) => handleChange("academicYear", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value={1}>Year 1</option>
                    <option value={2}>Year 2</option>
                    <option value={3}>Year 3</option>
                    <option value={4}>Year 4</option>
                    <option value={5}>Year 5</option>
                    <option value={6}>Year 6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session *</label>
                  <select
                    value={form.session}
                    onChange={(e) => handleChange("session", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value={1}>Session 1</option>
                    <option value={2}>Session 2</option>
                    <option value={3}>Session 3</option>
                    <option value={4}>Session 4</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                  <textarea
                    value={form.instructions}
                    onChange={(e) => handleChange("instructions", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
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
                    initialExam ? "Update Exam" : "Create Exam"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
