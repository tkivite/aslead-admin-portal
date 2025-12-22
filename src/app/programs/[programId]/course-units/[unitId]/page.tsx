"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { courseUnitsService } from "@/services/course-units.api";
import type { CourseUnit } from "@/types/courses.types";

export default function CourseUnitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const programId = parseInt(params.programId as string);
  const unitId = parseInt(params.unitId as string);

  const [unit, setUnit] = useState<CourseUnit | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUnit = useCallback(async () => {
    try {
      setLoading(true);
      const data = await courseUnitsService.getCourseUnit(programId, unitId);
      setUnit(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load unit");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [programId, unitId, router]);

  useEffect(() => {
    if (programId && unitId) {
      fetchUnit();
    }
  }, [programId, unitId, fetchUnit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.push(`/programs/${programId}`)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-5 h-5" />
          Back to Program
        </button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{unit?.name}</h1>
            <p className="text-sm text-gray-600">{unit?.code} • Year {unit?.academicYear} • Session {unit?.session}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Unit Details</h2>
            <p className="text-gray-700 mb-2">{unit?.description}</p>
            <div className="text-sm text-gray-600">Credits: {unit?.creditHours}</div>
          </div>

         
        </div>
      </div>
    </div>
  );
}
