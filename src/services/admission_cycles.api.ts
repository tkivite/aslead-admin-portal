
import api from "./api";
import { AdmissionCycle, AdmissionCycleCreateRequest} from "@/types/courses.types";
import { ApiResponse, PageResponse } from "@/types/api.types";

// Admission Cycles services
export const admissionCyclesService = {
  getAdmissionCycles: async (
    page = 0,
    size = 10
  ): Promise<PageResponse<AdmissionCycle>> => {
    const response = await api.get<ApiResponse<PageResponse<AdmissionCycle>>>(
      `/application/api/admissionCycles?page=${page}&size=${size}`
    );
    return response.data.body;
  },

  createAdmissionCycle: async (cycleData: AdmissionCycleCreateRequest) => {
    const response = await api.post(
      "/application/api/admission-cycles",
      cycleData
    );
    return response.data;
  },

  updateAdmissionCycle: async (
    cycleId: number,
    cycleData: Partial<AdmissionCycleCreateRequest>
  ) => {
    const response = await api.put(
      `/application/admission-cycles/${cycleId}`,
      cycleData
    );
    return response.data;
  },

  deleteAdmissionCycle: async (cycleId: number) => {
    const response = await api.delete(
      `/application/api/admission-cycles/${cycleId}`
    );
    return response.data;
  },
};
