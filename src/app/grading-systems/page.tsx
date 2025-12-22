"use client";

import React, { useEffect, useState } from "react";
import { Plus, Loader2, Edit3 } from "lucide-react";
import { toast } from "react-toastify";
import { gradingSystemService } from "@/services/grading-system.api";
import DataTable from "@/app/components/common/DataTable";
import GradingSystemModal from "@/app/exams/components/grading-system-modal";
import type { GradingSystem } from "@/types/grading.types";

export default function GradingSystemsPage() {
  const [gradingSystems, setGradingSystems] = useState<GradingSystem[]>([]);
  const [loadingGradingSystems, setLoadingGradingSystems] = useState(false);
  const [isGradingSystemModalOpen, setIsGradingSystemModalOpen] = useState(false);
  const [selectedGradingSystem, setSelectedGradingSystem] = useState<GradingSystem | null>(null);

  const fetchGradingSystems = React.useCallback(async () => {
    try {
      setLoadingGradingSystems(true);
      const data = await gradingSystemService.getGradingSystems();
      setGradingSystems(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load grading systems");
    } finally {
      setLoadingGradingSystems(false);
    }
  }, []);

  useEffect(() => {
    fetchGradingSystems();
  }, [fetchGradingSystems]);

  const handleEditGradingSystem = (gradingSystem: GradingSystem) => {
    setSelectedGradingSystem(gradingSystem);
    setIsGradingSystemModalOpen(true);
  };

  const handleGradingSystemSuccess = async () => {
    setSelectedGradingSystem(null);
    await fetchGradingSystems();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Grading Systems</h1>
          <p className="text-gray-600 mt-1">Manage grading systems</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSelectedGradingSystem(null);
                setIsGradingSystemModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Grading System
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {loadingGradingSystems ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : gradingSystems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No grading systems created yet</p>
              </div>
            ) : (
              <DataTable
                data={gradingSystems}
                columns={[
                  { key: "grade", label: "Grade" },
                  {
                    key: "marks",
                    label: "Marks Range",
                    render: (item: GradingSystem) => `${item.minMarks} - ${item.maxMarks}`,
                  },
                  { key: "gradePoint", label: "Grade Point" },
                  { key: "description", label: "Description" },
                  {
                    key: "actions",
                    label: "Actions",
                    render: (item: GradingSystem) => (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditGradingSystem(item)}
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

      <GradingSystemModal
        isOpen={isGradingSystemModalOpen}
        onClose={() => {
          setIsGradingSystemModalOpen(false);
          setSelectedGradingSystem(null);
        }}
        onSuccess={handleGradingSystemSuccess}
        initialGradingSystem={selectedGradingSystem}
      />
    </div>
  );
}
