"use client";

import React, { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DataTable from "@/app/components/common/DataTable";
import TableFilters from "@/app/components/common/TableFilters";
import { programsService } from "@/services/programs.api";
import { courseUnitsService } from "@/services/course-units.api";
import ExamModal from "@/app/programs/components/exam-modal";
import type { Exam } from "@/types/exams.types";
import type { Program } from "@/types/programs.types";
import type { CourseUnit } from "@/types/courses.types";

export default function ExamsPage() {
  const router = useRouter();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [units, setUnits] = useState<CourseUnit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

  const [examsResp, setExamsResp] = useState<{ content: Exam[] } | null>(null);
  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const p = await programsService.getPrograms();
        setPrograms(p);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load programs");
      }
    };
    loadPrograms();
  }, []);

  useEffect(() => {
    if (!selectedProgramId) return;
    const loadUnits = async () => {
      try {
        setLoadingUnits(true);
        const u = await courseUnitsService.getCourseUnits(selectedProgramId);
        setUnits(u);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load units");
      } finally {
        setLoadingUnits(false);
      }
    };
    loadUnits();
  }, [selectedProgramId]);

  useEffect(() => {
    if (!selectedUnitId) return;
    const loadExams = async () => {
      try {
        setLoadingExams(true);
        const data = await courseUnitsService.getExams(selectedUnitId);
        setExamsResp(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load exams");
      } finally {
        setLoadingExams(false);
      }
    };
    loadExams();
  }, [selectedUnitId]);

  const handleAdd = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
          <p className="text-gray-600 mt-1">Manage exams across programs and units</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
              <select
                value={selectedProgramId ?? ""}
                onChange={(e) => {
                  const v = e.target.value ? parseInt(e.target.value) : null;
                  setSelectedProgramId(v);
                  setSelectedUnitId(null);
                  setUnits([]);
                  setExamsResp(null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select program</option>
                {programs.map((p) => (
                  <option key={p.programId} value={p.programId}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={selectedUnitId ?? ""}
                onChange={(e) => setSelectedUnitId(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={!selectedProgramId || loadingUnits}
              >
                <option value="">Select unit</option>
                {units.map((u) => (
                  <option key={u.unitId} value={u.unitId}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleAdd}
                disabled={!selectedUnitId}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                Add Exam
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Exams</h2>
          </div>

          <TableFilters onFiltersChange={() => {}} showSearchFilter={true} showDateRangeFilter={true} />

          {loadingExams ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable
              data={examsResp?.content || []}
              loading={false}
              searchable={true}
              columns={[
                { key: "examName", label: "Exam" },
                { key: "examType", label: "Type", render: (item: Exam) => item.examType?.name || "-" },
                { key: "examDate", label: "Date" },
                { key: "totalMarks", label: "Total" },
                { key: "passingMarks", label: "Pass" },
              ]}
              onRowClick={(exam: Exam) =>
                router.push(`/exams/${exam.examId}?courseUnitId=${selectedUnitId}`)
              }
            />
          )}
        </div>
      </div>

      <ExamModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => selectedUnitId && courseUnitsService.getExams(selectedUnitId).then((d) => setExamsResp(d))}
        courseUnitId={selectedUnitId ?? 0}
      />
    </div>
  );
}
