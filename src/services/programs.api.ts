import api from "./api";
import type { ApiResponse } from "@/types/api.types";
import type { Program, ProgramPageResponse, CreateProgramData, UpdateProgramData } from "@/types/programs.types";

export const programsService = {
  // Get all programs
  getPrograms: async (): Promise<Program[]> => {
    const response = await api.get<ApiResponse<ProgramPageResponse>>(
      "/application/api/programs"
    );
    return response.data.body.content;
  },

  // Get program by ID
  getProgramById: async (programId: number): Promise<Program> => {
    const response = await api.get<ApiResponse<Program>>(
      `/application/api/programs/${programId}`
    );
    return response.data.body;
  },

  // Create new program
  createProgram: async (programData: CreateProgramData): Promise<Program> => {
    const response = await api.post<ApiResponse<Program>>(
      "/application/api/programs/new",
      programData
    );
    return response.data.body;
  },

  // Update program
  updateProgram: async (
    programId: number,
    programData: UpdateProgramData
  ): Promise<Program> => {
    const response = await api.put<ApiResponse<Program>>(
      `/application/api/programs/${programId}`,
      programData
    );
    return response.data.body;
  },
};
