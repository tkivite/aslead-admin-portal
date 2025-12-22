import api from "./api";
import type { ApiResponse } from "@/types/api.types";
import type { ExamStatistics, ExamMark } from "@/types/exams.types";
import type { PageResponse } from "@/types/api.types";

// Service for exam-specific endpoints (statistics, marks)
export const examsService = {
  getStatistics: async (examId: number): Promise<ExamStatistics> => {
    const response = await api.get<ApiResponse<ExamStatistics>>(
      `/application/api/exams/${examId}/statistics`
    );
    return response.data.body;
  },

  getMarks: async (
    examId: number,
    page = 0,
    size = 10
  ): Promise<PageResponse<ExamMark>> => {
    const response = await api.get<ApiResponse<PageResponse<ExamMark>>>(
      `/application/api/exams/${examId}/marks?page=${page}&size=${size}`
    );
    return response.data.body;
  },
};
