import api from "./api";
import type { ApiResponse } from "@/types/api.types";
import type {
  Program,
  ProgramPageResponse,
  CreateProgramData,
  UpdateProgramData,
  ProgramCost,
  CreateProgramCostData,
} from "@/types/programs.types";

const DEFAULT_PAGE_SIZE = 10;

export const programsService = {
  // Get all programs
  getPrograms: async (): Promise<Program[]> => {
    const response = await api.get<ApiResponse<ProgramPageResponse>>(
      "/application/api/programs",
    );
    return response.data.body.content;
  },

  // Get paginated programs
  getPaginatedPrograms: async (
    page = 0,
    size = DEFAULT_PAGE_SIZE,
    filters?: {
      search?: string;
      status?: string;
      sortBy?: string;
      sortDirection?: "ASC" | "DESC";
    },
  ): Promise<ProgramPageResponse> => {
    let url = `/application/api/programs?page=${page}&size=${size}`;

    if (filters?.search) {
      url += `&search=${encodeURIComponent(JSON.stringify({ name: filters.search, code: filters.search }))}`;
    } else {
      url += `&search=${encodeURIComponent(JSON.stringify({}))}`;
    }

    const sortBy = filters?.sortBy || "createdAt";
    const sortDirection = filters?.sortDirection || "DESC";
    url += `&sortby=${sortBy}&sortdirection=${sortDirection}`;

    if (filters?.status) {
      url += `&status=${encodeURIComponent(filters.status)}`;
    }

    const response = await api.get<ApiResponse<ProgramPageResponse>>(url);
    return response.data.body;
  },

  // Get program by ID
  getProgramById: async (programId: number): Promise<Program> => {
    const response = await api.get<ApiResponse<Program>>(
      `/application/api/programs/${programId}`,
    );
    return response.data.body;
  },

  // Create new program
  createProgram: async (programData: CreateProgramData): Promise<Program> => {
    const response = await api.post<ApiResponse<Program>>(
      "/application/api/programs/new",
      programData,
    );
    return response.data.body;
  },

  // Update program
  updateProgram: async (
    programId: number,
    programData: UpdateProgramData,
  ): Promise<Program> => {
    const response = await api.put<ApiResponse<Program>>(
      `/application/api/programs/${programId}`,
      programData,
    );
    return response.data.body;
  },

  // Update program cost
  updateProgramCost: async (
    programId: number,
    costId: number,
    costData: {
      description: string;
      amountInKES: number;
      amountInUSD: number | null;
    },
  ): Promise<ProgramCost> => {
    const response = await api.put<ApiResponse<ProgramCost>>(
      `/application/api/programs/${programId}/costs/${costId}`,
      costData,
    );
    return response.data.body;
  },

  // Add program cost
  addProgramCost: async (
    programId: number,
    costData: CreateProgramCostData,
  ): Promise<ProgramCost> => {
    const response = await api.post<ApiResponse<ProgramCost>>(
      `/application/api/programs/${programId}/costs/`,
      costData,
    );
    return response.data.body;
  },
};
