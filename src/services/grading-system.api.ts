import api from "./api";
import type { ApiResponse } from "@/types/api.types";
import type { GradingSystem, GradingSystemCreateRequest } from "@/types/grading.types";

export const gradingSystemService = {
  getGradingSystems: async (): Promise<GradingSystem[]> => {
    const response = await api.get<ApiResponse<GradingSystem[]>>(
      `/application/api/gradingSystem`
    );
    return response.data.body || [];
  },

  createGradingSystem: async (data: GradingSystemCreateRequest): Promise<GradingSystem> => {
    const response = await api.post<ApiResponse<GradingSystem>>(
      `/application/api/gradingSystem`,
      data
    );
    return response.data.body;
  },

  updateGradingSystem: async (gradeId: number, data: GradingSystemCreateRequest): Promise<GradingSystem> => {
    const response = await api.put<ApiResponse<GradingSystem>>(
      `/application/api/gradingSystem/${gradeId}`,
      data
    );
    return response.data.body;
  },

  deleteGradingSystem: async (gradeId: number): Promise<void> => {
    await api.delete(`/application/api/gradingSystem/${gradeId}`);
  },
};

export default gradingSystemService;
