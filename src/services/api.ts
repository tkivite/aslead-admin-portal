import {
  AdmissionCycle,
  AdmissionCycleCreateRequest,
  ApiResponse,
  Application,
  AuthResponse,
  EnrollmentRequest,
  PageResponse,
  Program,
  ProgramCreateRequest,
  UserCreateRequest,
} from "@/types/api.types";
import axios from "axios";

const BASE_URL = "http://80.209.230.177:6001/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = "/login";
          return Promise.reject(error);
        }

    
        const response = await fetch(
          "http://80.209.230.177:5999/aslead/api/v1/auth/refresh",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token : refreshToken }),
          }
        );

        const data = await response.json();
        const { access_token } = data;

        localStorage.setItem("access_token", access_token);
        originalRequest.headers.Authorization = `${access_token}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh token failed, redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(
      "http://80.209.230.177:5999/aslead/api/v1/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    return data as AuthResponse;
  },
};

// Applications services
export const applicationsService = {
  getApplications: async (
    page = 0,
    size = 10
  ): Promise<PageResponse<Application>> => {
    const response = await api.get<ApiResponse<PageResponse<Application>>>(
      `/applications?page=${page}&size=${size}`
    );
    return response.data.body;
  },

  approveApplication: async (
    applicantId: number,
    enrollmentStatus: string,
    enrolledAt: string
  ) => {
    const payload: EnrollmentRequest = {
      applicant: {
        applicantId,
      },
      enrollmentStatus,
      enrolledAt,
    };
    const response = await api.post("/offers/new", payload);
    return response.data;
  },
};

// Programs/Courses services
export const programsService = {
  getPrograms: async (page = 0, size = 10): Promise<PageResponse<Program>> => {
    const response = await api.get<ApiResponse<PageResponse<Program>>>(
      `programs?action=fetch&page=${page}&size=${size}`
    );
    return response.data.body;
  },

  createProgram: async (programData: ProgramCreateRequest) => {
    const response = await api.post("/programs", programData);
    return response.data;
  },

  updateProgram: async (
    programId: number,
    programData: Partial<ProgramCreateRequest>
  ) => {
    const response = await api.put(`/programs/${programId}`, programData);
    return response.data;
  },

  deleteProgram: async (programId: number) => {
    const response = await api.delete(`/programs/${programId}`);
    return response.data;
  },
};

// Admission Cycles services
export const admissionCyclesService = {
  getAdmissionCycles: async (
    page = 0,
    size = 10
  ): Promise<PageResponse<AdmissionCycle>> => {
    const response = await api.get<ApiResponse<PageResponse<AdmissionCycle>>>(
      `/admissionCycles?page=${page}&size=${size}`
    );
    return response.data.body;
  },

  createAdmissionCycle: async (cycleData: AdmissionCycleCreateRequest) => {
    const response = await api.post("/admission-cycles", cycleData);
    return response.data;
  },

  updateAdmissionCycle: async (
    cycleId: number,
    cycleData: Partial<AdmissionCycleCreateRequest>
  ) => {
    const response = await api.put(`/admission-cycles/${cycleId}`, cycleData);
    return response.data;
  },

  deleteAdmissionCycle: async (cycleId: number) => {
    const response = await api.delete(`/admission-cycles/${cycleId}`);
    return response.data;
  },
};

// Users services
export const usersService = {
  getUsers: async (page = 0, size = 10) => {
    const response = await api.get(`/users?page=${page}&size=${size}`);
    return response.data;
  },

  createUser: async (userData: UserCreateRequest) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  updateUser: async (userId: number, userData: Partial<UserCreateRequest>) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

export default api;
