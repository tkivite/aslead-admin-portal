"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { examTypesService, type ExamTypeCreateRequest } from "@/services/exam-types.api";
import type { ExamType } from "@/types/exams.types";

interface ExamTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialExamType?: ExamType | null;
}

export default function ExamTypeModal({ isOpen, onClose, onSuccess, initialExamType = null }: ExamTypeModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ExamTypeCreateRequest>({
    name: "",
    description: "",
    weightPercentage: 0,
  });

  useEffect(() => {
    if (initialExamType) {
      setForm({
        name: initialExamType.name,
        description: initialExamType.description || "",
        weightPercentage: initialExamType.weightPercentage || 0,
      });
    } else {
      setForm({
        name: "",
        description: "",
        weightPercentage: 0,
      });
    }
  }, [initialExamType, isOpen]);

  const handleChange = (key: keyof ExamTypeCreateRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!form.name || !form.description) {
      toast.error("Please provide exam type name and description");
      return;
    }

    if (form.weightPercentage < 0 || form.weightPercentage > 100) {
      toast.error("Weight percentage must be between 0 and 100");
      return;
    }

    setSubmitting(true);
    try {
      if (initialExamType) {
        await examTypesService.updateExamType(initialExamType.examTypeId, form);
        toast.success("Exam type updated successfully");
      } else {
        await examTypesService.createExamType(form);
        toast.success("Exam type created successfully");
      }
      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save exam type. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({
      name: "",
      description: "",
      weightPercentage: 0,
    });
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
            className="relative z-10 w-full max-w-md p-6 bg-white rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {initialExamType ? "Edit Exam Type" : "Create Exam Type"}
              </h3>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Type Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g., CAT, Mid-Term, Final Exam"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="e.g., Continuous Assessment Test"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight Percentage *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={form.weightPercentage}
                    onChange={(e) => handleChange("weightPercentage", parseFloat(e.target.value || "0"))}
                    min="0"
                    max="100"
                    step="0.1"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <span className="text-gray-600 font-medium">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">The weight of this exam in overall assessment (0-100%)</p>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    initialExamType ? "Update Exam Type" : "Create Exam Type"
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
