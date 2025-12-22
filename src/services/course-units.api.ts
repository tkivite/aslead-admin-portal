import api from "./api";
import type { ApiResponse } from "@/types/api.types";
import type {
  CourseUnit,
  CourseUnitCreateRequest,
  CourseUnitUpdateRequest,
} from "@/types/courses.types";
import type { Exam, ExamCreateRequest } from "@/types/exams.types";

// Course Units services
export const courseUnitsService = {
  // Get all course units for a program
  getCourseUnits: async (programId: number): Promise<CourseUnit[]> => {
    const response = await api.get<ApiResponse<{ content: CourseUnit[] }>>(
      `/application/api/programs/${programId}/courseUnits`
    );
    return response.data.body.content;
  },

  // Create a new course unit
  createCourseUnit: async (
    programId: number,
    unitData: CourseUnitCreateRequest
  ): Promise<CourseUnit> => {
    const response = await api.post<ApiResponse<CourseUnit>>(
      `/application/api/programs/${programId}/courseUnits`,
      unitData
    );
    return response.data.body;
  },

  // Update a course unit
  updateCourseUnit: async (
    programId: number,
    unitId: number,
    unitData: CourseUnitUpdateRequest
  ): Promise<CourseUnit> => {
    const response = await api.put<ApiResponse<CourseUnit>>(
      `/application/api/programs/${programId}/courseUnits/${unitId}`,
      unitData
    );
    return response.data.body;
  },

  // Delete a course unit
  deleteCourseUnit: async (
    programId: number,
    unitId: number
  ): Promise<void> => {
    await api.delete(
      `/application/api/programs/${programId}/courseUnits/${unitId}`
    );
  },

  // Get single course unit
  getCourseUnit: async (
    programId: number,
    unitId: number
  ): Promise<CourseUnit> => {
    const response = await api.get<ApiResponse<CourseUnit>>(
      `/application/api/programs/${programId}/courseUnits/${unitId}`
    );
    return response.data.body;
  },

  // Exams related to a course unit
  getExams: async (
    courseUnitId: number
  ): Promise<{ content: Exam[] }> => {
    const response = await api.get<ApiResponse<{ content: Exam[] }>>(
      `/application/api/courseUnits/${courseUnitId}/exams`
    );
    return response.data.body;
  },

  getExamById: async (courseUnitId: number, examId: number): Promise<Exam> => {
    const response = await api.get<ApiResponse<Exam>>(
      `/application/api/courseUnits/${courseUnitId}/exams/${examId}`
    );
    return response.data.body;
  },

  createExam: async (
    courseUnitId: number,
    examData: ExamCreateRequest
  ): Promise<Exam> => {
    const response = await api.post<ApiResponse<Exam>>(
      `/application/api/courseUnits/${courseUnitId}/exams`,
      examData
    );
    return response.data.body;
  },

  updateExam: async (
    courseUnitId: number,
    examId: number,
    examData: ExamCreateRequest
  ): Promise<Exam> => {
    const response = await api.put<ApiResponse<Exam>>(
      `/application/api/courseUnits/${courseUnitId}/exams/${examId}`,
      examData
    );
    return response.data.body;
  },

  deleteExam: async (courseUnitId: number, examId: number): Promise<void> => {
    await api.delete(
      `/application/api/courseUnits/${courseUnitId}/exams/${examId}`
    );
  },
};
