import api from "./api";
import { Student } from "@/types/students.types";
import { Program } from "@/types/programs.types";
import { Campus } from "@/types/campuses.types";
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
      `/application/api/students?search=${searchParams}&sortby=createdAt&sortdirection=DESC&size=10&page=0&action=fetch`
    );
    return response.data.body;
  },

  // Get paginated students
  getPaginatedStudents: async (
    page = 0,
    size = 10,
    enrollmentStatus?: string,
    filters?: {
      search?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      sortDirection?: "ASC" | "DESC";
      campusId?: number;
      programId?: number;
    }
  ): Promise<PageResponse<Student>> => {
    let url = `/application/api/students?size=${size}&page=${page}&action=fetch`;
    
    // Build search parameters - only include search fields, not enrollmentStatus
    const searchParams: Record<string, string> = {};
    
    // Add search fields if search keyword is provided
    if (filters?.search) {
      const keyword = filters.search;
      searchParams["applicant.firstName"] = keyword;
      searchParams["applicant.lastName"] = keyword;
      searchParams["applicant.email"] = keyword;
      searchParams["applicant.mobile"] = keyword;
    }
    
    // Add search parameter (can be empty object if no search)
    if (Object.keys(searchParams).length > 0) {
      url += `&search=${encodeURIComponent(JSON.stringify(searchParams))}`;
    } else {
      url += `&search=${encodeURIComponent(JSON.stringify({}))}`;
    }
    
    // Add sorting
    const sortBy = filters?.sortBy || "createdAt";
    const sortDirection = filters?.sortDirection || "DESC";
    url += `&sortby=${sortBy}&sortdirection=${sortDirection}`;
    
    // Add date filters
    if (filters?.startDate) {
      url += `&startdate=${filters.startDate}`;
    }
    if (filters?.endDate) {
      url += `&enddate=${filters.endDate}`;
    }
    
    // Add campus and program filters
    if (filters?.campusId) {
      url += `&campusId=${filters.campusId}`;
    }
    if (filters?.programId) {
      url += `&programId=${filters.programId}`;
    }
    
    // Add enrollmentStatus as standalone parameter
    if (enrollmentStatus) {
      url += `&enrollmentStatus=${enrollmentStatus}`;
    }
    
    // Add status parameter (APPROVED for enrolled/exited students)
    url += `&status=APPROVED`;
    
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

  // Update student information
  updateStudent: async (studentId: number, studentData: {
    applicantInfo: {
      firstName: string;
      lastName: string;
      email: string;
      mobile: string;
      dob: string;
      gender: string;
      citizenship: string;
      currentEducationLevel: string;
    };
    programId: number;
    campusId: number;
    enrollmentStatus: string;
  }) => {
    const response = await api.put<ApiResponse<Student>>(
      `/application/api/students/${studentId}`,
      studentData
    );
    return response.data;
  },

  // Update student enrollment status
  updateStudentStatus: async (studentId: number, enrollmentStatus: string) => {
    const response = await api.patch<ApiResponse<Student>>(
      `/application/api/students/${studentId}/status`,
      { enrollmentStatus }
    );
    return response.data;
  },
};
