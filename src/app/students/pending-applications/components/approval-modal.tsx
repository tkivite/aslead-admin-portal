"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, GraduationCap, Check } from "lucide-react";
import type { Application } from "@/types/applications.types";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startYear: number, startMonth: string) => void;
  application: Application | null;
  isSubmitting: boolean;
}

const MONTHS = [
  "JANUARY",
  "FEBRUARY", 
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER"
];

export default function ApprovalModal({
  isOpen,
  onClose,
  onConfirm,
  application,
  isSubmitting,
}: ApprovalModalProps) {
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear() + 1);
  const [startMonth, setStartMonth] = useState<string>("JANUARY");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(startYear, startMonth);
  };

  const handleClose = () => {
    setStartYear(new Date().getFullYear() + 1);
    setStartMonth("JANUARY");
    onClose();
  };

  if (!application) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75"
            onClick={handleClose}
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-md p-6 bg-white rounded-2xl shadow-xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-tertiary/10 rounded-lg">
                  <Check className="h-6 w-6 text-tertiary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-textDark">
                    Approve Application
                  </h3>
                  <p className="text-sm text-gray-600">
                    Set enrollment details for this student
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Student Info */}
            <div className="mb-6 p-4 bg-backgroundsecondary rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="font-medium text-textDark">Student Details</span>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-medium text-textDark">
                  {application.applicant.firstName} {application.applicant.lastName}
                </p>
                <p className="text-gray-600">{application.applicant.email}</p>
                <p className="text-gray-600">
                  {application.program.name} - {application.campus.name}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Start Year */}
              <div>
                <label className="block text-sm font-medium text-textDark mb-2">
                  Start Year
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={startYear}
                    onChange={(e) => setStartYear(parseInt(e.target.value))}
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 5}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent transition-colors"
                    placeholder="Select start year"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Start Month */}
              <div>
                <label className="block text-sm font-medium text-textDark mb-2">
                  Start Month
                </label>
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent transition-colors"
                  required
                  disabled={isSubmitting}
                >
                  {MONTHS.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-tertiary text-white rounded-lg hover:bg-tertiary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Approving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Approve Application
                    </>
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
