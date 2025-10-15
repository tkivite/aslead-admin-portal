import axios from "axios";
import { authService } from "./auth.api";

// const BASE_URL = "https://gateway.itiksolutions.com/aslead/api";
// const BASE_URL = "https://gateway.itiksolutions.com/aslead/sandbox";
// Create axios instance with default config
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log(BASE_URL);

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token || undefined);
    }
  });
  
  failedQueue = [];
};

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessTokenSite");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `${token}`;
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = authService.getStoredTokens();
        if (!tokens) {
          throw new Error("No refresh token available");
        }

        const refreshResponse = await authService.refreshToken(tokens.refreshToken);
        authService.saveTokens(refreshResponse);
        
        // Update the original request with new token
        originalRequest.headers.Authorization = `${refreshResponse.access_token}`;
        
        // Process queued requests
        processQueue(null, refreshResponse.access_token);
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        processQueue(refreshError, null);
        authService.clearTokens();
        
        // Redirect to login if not already there
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
