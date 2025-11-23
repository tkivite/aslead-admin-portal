import api from "./api";
import type { ApiResponse} from "@/types/api.types";
import type { CourseUnit, CourseUnitCreateRequest, CourseUnitUpdateRequest } from "@/types/courses.types";

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
  deleteCourseUnit: async (programId: number, unitId: number): Promise<void> => {
    await api.delete(`/application/api/programs/${programId}/courseUnits/${unitId}`);
  },
};
