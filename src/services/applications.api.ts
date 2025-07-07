import api from "./api"
import type { ApiResponse, PageResponse } from "@/types/api.types"
import type { Application,Document } from "@/types/applications.types"


// Applications services
export const applicationsService = {
  getApplications: async (page = 0, size = 1): Promise<PageResponse<Application>> => {
    const response = await api.get<ApiResponse<PageResponse<Application>>>(
      `/application/api/applications?page=${page}&size=${size}`,
    )
    return response.data.body
  },

  getPendingApplications: async (): Promise<PageResponse<Application>> => {
    const searchParams = encodeURIComponent(JSON.stringify({ status: "PENDING" }))
    const response = await api.get<ApiResponse<PageResponse<Application>>>(
      `/application/api/applications?search=${searchParams}&sortby=createdAt&sortdirection=DESC&size=10&page=0&action=search`,
    )
    return response.data.body
  },

  // Get approved applications
  getApprovedApplications: async (): Promise<PageResponse<Application>> => {
    const searchParams = encodeURIComponent(JSON.stringify({ status: "APPROVED" }))
    const response = await api.get<ApiResponse<PageResponse<Application>>>(
      `/application/api/applications?search=${searchParams}&sortby=createdAt&sortdirection=DESC&size=10&page=0&action=search`,
    )
    return response.data.body
  },

  getRecentApplications: async (): Promise<PageResponse<Application>> => {
    const response = await api.get<ApiResponse<PageResponse<Application>>>(
      `/application/api/applications?search=&sortby=createdAt&sortdirection=DESC&size=10&page=0&action=fetch`,
    )
    return response.data.body
  },

  // Get paginated applications
  getPaginatedApplications: async (page = 0, size = 10, status?: string): Promise<PageResponse<Application>> => {
    let url = `/application/api/applications?sortby=createdAt&sortdirection=DESC&size=${size}&page=${page}&action=search`
    if (status) {
      const searchParams = encodeURIComponent(JSON.stringify({ status }))
      url += `&search=${searchParams}`
    } else {
      url += `&search=`
    }
    const response = await api.get<ApiResponse<PageResponse<Application>>>(url)
    return response.data.body
  },

  // Approve application
  approveApplication: async (applicantId: number, applicationId: number): Promise<void> => {
    const payload = {
      applicant: {
        applicantId: applicantId,
      },
      application: {
        applicationId: applicationId,
      },
      enrollmentStatus: "ENROLLED",
      enrolledAt: new Date().toISOString().slice(0, 19).replace("T", " "),
    }

    await api.post("/aslead/application/api/students/new", payload)
  },
    // Get documents for an applicant
  getApplicantDocuments: async (applicantId: number): Promise<Document[]> => {
    const response = await api.get<Document[]>(`/application/api/documents/${applicantId}`)
    return response.data || []
  },
}
