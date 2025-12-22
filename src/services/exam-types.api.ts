import api from "./api";
import type { ApiResponse } from "@/types/api.types";
import type { ExamType } from "@/types/exams.types";

interface GetExamTypesParams {
  sortby?: string;
  sortdirection?: string;
  size?: number;
  page?: number;
  startdate?: string;
  enddate?: string;
  action?: string;
}

export interface ExamTypeCreateRequest {
  name: string;
  description: string;
  weightPercentage: number;
}

export const examTypesService = {
  getExamTypes: async (params: GetExamTypesParams = {}): Promise<ExamType[]> => {
    const qs = new URLSearchParams({
      sortby: params.sortby || "createdAt",
      sortdirection: params.sortdirection || "DESC",
      size: String(params.size ?? 10),
      page: String(params.page ?? 0),
      startdate: params.startdate || "",
      enddate: params.enddate || "",
      action: params.action || "fetch",
    });

    const response = await api.get(`/application/api/examTypes?${qs.toString()}`);

    // Backend returns body as an array directly
    return response.data.body || [];
  },

  createExamType: async (data: ExamTypeCreateRequest): Promise<ExamType> => {
    const response = await api.post<ApiResponse<ExamType>>(
      `/application/api/examTypes`,
      data
    );
    return response.data.body;
  },

  updateExamType: async (examTypeId: number, data: ExamTypeCreateRequest): Promise<ExamType> => {
    const response = await api.put<ApiResponse<ExamType>>(
      `/application/api/examTypes/${examTypeId}`,
      data
    );
    return response.data.body;
  },

  deleteExamType: async (examTypeId: number): Promise<void> => {
    await api.delete(`/application/api/examTypes/${examTypeId}`);
  },
};


export default examTypesService;
