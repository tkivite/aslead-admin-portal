import api from "./api";
import { ApiResponse, PageResponse } from "@/types/api.types";
import { Program, ProgramCreateRequest } from "@/types/courses.types";

export const programsService = {
  getPrograms: async (page = 0, size = 10): Promise<PageResponse<Program>> => {
    const response = await api.get<ApiResponse<PageResponse<Program>>>(
      `/application/api/programs?action=fetch&page=${page}&size=${size}`
    );
    return response.data.body;
  },

  createProgram: async (programData: ProgramCreateRequest) => {
    const response = await api.post("/application/api/programs", programData);
    return response.data;
  },

  updateProgram: async (
    programId: number,
    programData: Partial<ProgramCreateRequest>  
  ) => {
    const response = await api.put(
      `/application/api/programs/${programId}`,
      programData
    );
    return response.data;
  },

  deleteProgram: async (programId: number) => {
    const response = await api.delete(`/application/api/programs/${programId}`);
    return response.data;
  },
};
