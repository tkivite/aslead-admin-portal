import api from "./api";
import { Student } from "@/types/students.types";
import { ApiResponse, PageResponse } from "@/types/api.types";

// Students services
export const studentsService = {
  getStudents: async (page = 0, size = 10): Promise<PageResponse<Student>> => {
    const response = await api.get<ApiResponse<PageResponse<Student>>>(
      `/application/api/students?page=${page}&size=${size}`
    );
    return response.data.body;
  },
  getActiveStudents: async (): Promise<PageResponse<Student>> => {
    const searchParams = encodeURIComponent(
      JSON.stringify({ enrollmentStatus: "ENROLLED" })
    );
    const response = await api.get<ApiResponse<PageResponse<Student>>>(
      `/application/api/students?search=${searchParams}&sortby=createdAt&sortdirection=DESC&size=10&page=0&action=fetch`
    );
    return response.data.body;
  },
  // Get exited students
  getExitedStudents: async (): Promise<PageResponse<Student>> => {
    const searchParams = encodeURIComponent(
      JSON.stringify({ enrollmentStatus: "COMPLETED" })
    );
    const response = await api.get<ApiResponse<PageResponse<Student>>>(
      `/application/api/students?search=${searchParams}&sortby=createdAt&sortdirection=DESC&size=10&page=0&action=search`
    );
    return response.data.body;
  },

  // Get paginated students
  getPaginatedStudents: async (
    page = 0,
    size = 10,
    enrollmentStatus?: string
  ): Promise<PageResponse<Student>> => {
    let url = `/application/api/students?sortby=createdAt&sortdirection=DESC&size=${size}&page=${page}&action=fetch`;
    if (enrollmentStatus) {
      const searchParams = encodeURIComponent(
        JSON.stringify({ enrollmentStatus })
      );
      url += `&search=${searchParams}`;
    } else {
      url += `&search=`;
    }
    const response = await api.get<ApiResponse<PageResponse<Student>>>(url);
    return response.data.body;
  },
};
