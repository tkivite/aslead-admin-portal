import api from "./api";
import { Campus, Program, Student } from "@/types/students.types";
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
  // Get all programs
  getPrograms: async (): Promise<Program[]> => {
    const response = await api.get<ApiResponse<{ content: Program[] }>>(
      "/application/api/programs?action=fetch"
    );
    return response.data.body.content;
  },

  // Get all campuses
  getCampuses: async (): Promise<Campus[]> => {
    const response = await api.get<ApiResponse<{ content: Campus[] }>>(
      "/application/api/allCampuses"
    );
    return response.data.body.content;
  },

  // Add new student (create application)
  addStudent: async (studentData: {
    programId: number;
    campusId: number;
    additionalInfo: string;
    paymentReference: string;
    applicantInfo: {
      firstName: string;
      lastName: string;
      email: string | null;
      mobile: string;
      dob: string;
      gender: string;
      citizenship: string;
      currentEducationLevel: string;
      documentType: string;
      documentNumber: string;
    };
    documents: Array<{
      documentType: string;
      content: string;
      status: "PENDING";
    }>;
  }) => {
    const response = await api.post<ApiResponse<Student>>(
      "/application/api/applications/new",
      studentData
    );
    return response.data;
  },
};
