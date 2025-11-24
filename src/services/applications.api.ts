import api from "./api";
import type { ApiResponse, PageResponse } from "@/types/api.types";
import type { Application, Document, DocumentResponse } from "@/types/applications.types";

// Applications services
export const applicationsService = {
  getApplications: async (
    page = 0,
    size = 1
  ): Promise<PageResponse<Application>> => {
    const response = await api.get<ApiResponse<PageResponse<Application>>>(
      `/application/api/applications?page=${page}&size=${size}`
    );
    return response.data.body;
  },

  getPendingApplications: async (): Promise<PageResponse<Application>> => {
    const searchParams = encodeURIComponent(
      JSON.stringify({ status: "PENDING" })
    );
    const response = await api.get<ApiResponse<PageResponse<Application>>>(
      `/application/api/applications?search=${searchParams}&sortby=createdAt&sortdirection=DESC&size=10&page=0&action=fetch`
    );
    return response.data.body;
  },

  // Get approved applications
  getApprovedApplications: async (): Promise<PageResponse<Application>> => {
    const searchParams = encodeURIComponent(
      JSON.stringify({ status: "APPROVED" })
    );
    const response = await api.get<ApiResponse<PageResponse<Application>>>(
      `/application/api/applications?search=${searchParams}&sortby=createdAt&sortdirection=DESC&size=10&page=0&action=fetch`
    );
    return response.data.body;
  },

  getRecentApplications: async (): Promise<PageResponse<Application>> => {
    const response = await api.get<ApiResponse<PageResponse<Application>>>(
      `/application/api/applications?search=&sortby=createdAt&sortdirection=DESC&size=10&page=0&action=fetch`
    );
    return response.data.body;
  },

  // Get paginated applications
  getPaginatedApplications: async (
    page = 0,
    size = 10,
    status?: string,
    filters?: {
      search?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      sortDirection?: "ASC" | "DESC";
      campusId?: number;
      programId?: number;
    }
  ): Promise<PageResponse<Application>> => {
    let url = `/application/api/applications?size=${size}&page=${page}&action=fetch`;
    
    // Add status as separate parameter
    if (status) {
      url += `&status=${status}`;
    }
    
    // Build search parameters (excluding status)
    const searchParams: Record<string, string> = {};
    
    // Add search fields if search keyword is provided
    if (filters?.search) {
      const keyword = filters.search;
      searchParams["applicant.firstName"] = keyword;
      searchParams["applicant.lastName"] = keyword;
      searchParams["applicant.email"] = keyword;
      searchParams["applicant.mobile"] = keyword;
    }
    
    if (Object.keys(searchParams).length > 0) {
      url += `&search=${encodeURIComponent(JSON.stringify(searchParams))}`;
    } else {
      url += `&search=`;
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
    
    const response = await api.get<ApiResponse<PageResponse<Application>>>(url);
    return response.data.body;
  },

  // Approve application
  approveApplication: async (
    applicantId: number,
    applicationId: number,
    startYear: number,
    startMonth: string
  ): Promise<void> => {
    const payload = {
      applicant: {
        applicantId: applicantId,
      },
      application: {
        applicationId: applicationId,
      },
      enrollmentStatus: "ENROLLED",
      enrolledAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      startYear: startYear,
      startMonth: startMonth,
    };

    await api.post("/application/api/students/new", payload);
  },
  // Get documents for an applicant
  getApplicantDocuments: async (applicantId: number): Promise<Document[]> => {
    const response = await api.get<DocumentResponse>(
      `/application/api/documents/applicant/${applicantId}`
    );
     return response.data.body || [];
  },

  // Update application
  updateApplication: async (
    applicationId: number,
    updateData: {
      programId: number;
      admissionCycleId: number | null;
      campusId: number;
      additionalInfo: string;
      paymentReference: string;
      applicantInfo: {
        firstName: string;
        lastName: string;
        email: string;
        mobile: string;
        dob: string;
        citizenship: string;
        currentEducationLevel: string;
        documentType: string;
        documentNumber: string;
      };
      documents: Array<{
        documentType: string;
        content: string;
      }>;
      applicantId:number
    
  
    }
  ): Promise<void> => {
    await api.put(`/application/api/applications/${applicationId}`, updateData);
  },
};
