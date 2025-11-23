import api from "./api";
import type { ApiResponse } from "@/types/api.types";
import type { Campus, CampusPageResponse, CreateCampusData, UpdateCampusData } from "@/types/campuses.types";

export const campusesService = {
  // Get all campuses
  getCampuses: async (): Promise<Campus[]> => {
    const response = await api.get<ApiResponse<CampusPageResponse>>(
      "/application/api/campuses/"
    );
    return response.data.body.content;
  },

  // Get paginated campuses
  getPaginatedCampuses: async (
    page = 0,
    size = 10,
    filters?: {
      search?: string;
      sortBy?: string;
      sortDirection?: "ASC" | "DESC";
      country?: string;
      county?: string;
    }
  ): Promise<CampusPageResponse> => {
    let url = `/application/api/campuses/?page=${page}&size=${size}`;
    
    // Build search parameters - only include search fields, not filters
    const searchParams: Record<string, string> = {};
    
    // Add search fields if search keyword is provided
    if (filters?.search) {
      const keyword = filters.search;
      searchParams["name"] = keyword;
      searchParams["location"] = keyword;
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
    
    // Add country filter as standalone parameter
    if (filters?.country) {
      url += `&country=${encodeURIComponent(filters.country)}`;
    }
    
    // Add county filter as standalone parameter
    if (filters?.county) {
      url += `&county=${encodeURIComponent(filters.county)}`;
    }
    
    const response = await api.get<ApiResponse<CampusPageResponse>>(url);
    return response.data.body;
  },

  // Get campus by ID
  getCampusById: async (campusId: number): Promise<Campus> => {
    const response = await api.get<ApiResponse<Campus>>(
      `/application/api/campuses/${campusId}`
    );
    return response.data.body;
  },

  // Create new campus
  createCampus: async (campusData: CreateCampusData): Promise<Campus> => {
    const response = await api.post<ApiResponse<Campus>>(
      "/application/api/campuses/new",
      campusData
    );
    return response.data.body;
  },

  // Update campus
  updateCampus: async (
    campusId: number,
    campusData: UpdateCampusData
  ): Promise<Campus> => {
    const response = await api.put<ApiResponse<Campus>>(
      `/application/api/campuses/${campusId}`,
      campusData
    );
    return response.data.body;
  },
};
