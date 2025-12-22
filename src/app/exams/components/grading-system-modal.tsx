"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { gradingSystemService } from "@/services/grading-system.api";
import { GradingSystemCreateRequest } from "@/types/grading.types";
import type { GradingSystem } from "@/types/grading.types";

interface GradingSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialGradingSystem?: GradingSystem | null;
}

export default function GradingSystemModal({
  isOpen,
  onClose,
  onSuccess,
  initialGradingSystem = null,
}: GradingSystemModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<GradingSystemCreateRequest>({
    grade: "",
    minMarks: 0,
    maxMarks: 0,
    gradePoint: 0,
    description: "",
  });

  useEffect(() => {
    if (initialGradingSystem) {
      setForm({
        grade: initialGradingSystem.grade,
        minMarks: initialGradingSystem.minMarks,
        maxMarks: initialGradingSystem.maxMarks,
        gradePoint: initialGradingSystem.gradePoint,
        description: initialGradingSystem.description || "",
      });
    } else {
      setForm({
        grade: "",
        minMarks: 0,
        maxMarks: 0,
        gradePoint: 0,
        description: "",
      });
    }
  }, [initialGradingSystem, isOpen]);

  const handleChange = (key: keyof GradingSystemCreateRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!form.grade) {
      toast.error("Please provide a grade");
      return;
    }

    if (form.maxMarks < form.minMarks) {
      toast.error("Max marks must be greater than or equal to min marks");
      return;
    }

    setSubmitting(true);
    try {
      if (initialGradingSystem) {
        await gradingSystemService.updateGradingSystem(initialGradingSystem.gradeId, form);
        toast.success("Grading system updated successfully");
      } else {
        await gradingSystemService.createGradingSystem(form);
        toast.success("Grading system created successfully");
      }
      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save grading system. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({
      grade: "",
      minMarks: 0,
      maxMarks: 0,
      gradePoint: 0,
      description: "",
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
                {initialGradingSystem ? "Edit Grading System" : "Create Grading System"}
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
                  Grade *
                </label>
                <input
                  type="text"
                  value={form.grade}
                  onChange={(e) => handleChange("grade", e.target.value)}
                  placeholder="e.g., A, B, C, D, E"
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Marks *
                  </label>
                  <input
                    type="number"
                    value={form.minMarks}
                    onChange={(e) => handleChange("minMarks", parseFloat(e.target.value || "0"))}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Marks *
                  </label>
                  <input
                    type="number"
                    value={form.maxMarks}
                    onChange={(e) => handleChange("maxMarks", parseFloat(e.target.value || "0"))}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Point *
                </label>
                <input
                  type="number"
                  value={form.gradePoint}
                  onChange={(e) => handleChange("gradePoint", parseFloat(e.target.value || "0"))}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="e.g., Excellent, Good, Poor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
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
                    initialGradingSystem ? "Update Grading System" : "Create Grading System"
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
