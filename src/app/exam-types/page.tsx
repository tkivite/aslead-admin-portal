"use client";

import React, { useEffect, useState } from "react";
import { Plus, Loader2, Edit3 } from "lucide-react";
import { toast } from "react-toastify";
import { examTypesService } from "@/services/exam-types.api";
import DataTable from "@/app/components/common/DataTable";
import ExamTypeModal from "@/app/exams/components/exam-type-modal";
import type { ExamType } from "@/types/exams.types";

export default function ExamTypesPage() {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [loadingExamTypes, setLoadingExamTypes] = useState(false);
  const [isExamTypeModalOpen, setIsExamTypeModalOpen] = useState(false);
  const [selectedExamType, setSelectedExamType] = useState<ExamType | null>(null);

  const fetchExamTypes = React.useCallback(async () => {
    try {
      setLoadingExamTypes(true);
      const data = await examTypesService.getExamTypes();
      setExamTypes(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load exam types");
    } finally {
      setLoadingExamTypes(false);
    }
  }, []);

  useEffect(() => {
    fetchExamTypes();
  }, [fetchExamTypes]);

  const handleEditExamType = (examType: ExamType) => {
    setSelectedExamType(examType);
    setIsExamTypeModalOpen(true);
  };

  const handleExamTypeSuccess = async () => {
    setSelectedExamType(null);
    await fetchExamTypes();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exam Types</h1>
          <p className="text-gray-600 mt-1">Manage exam types</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSelectedExamType(null);
                setIsExamTypeModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Exam Type
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {loadingExamTypes ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : examTypes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No exam types created yet</p>
              </div>
            ) : (
              <DataTable
                data={examTypes}
                columns={[
                  { key: "name", label: "Name" },
                  { key: "description", label: "Description" },
                  {
                    key: "weightPercentage",
                    label: "Weight %",
                    render: (item: ExamType) => `${item.weightPercentage}%`,
                  },
                  {
                    key: "actions",
                    label: "Actions",
                    render: (item: ExamType) => (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditExamType(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    ),
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>

      <ExamTypeModal
        isOpen={isExamTypeModalOpen}
        onClose={() => {
          setIsExamTypeModalOpen(false);
          setSelectedExamType(null);
        }}
        onSuccess={handleExamTypeSuccess}
        initialExamType={selectedExamType}
      />
    </div>
  );
}
