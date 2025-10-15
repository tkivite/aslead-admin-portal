import { AuthResponse } from "@/types/api.types";

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/api/v1/login`,
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

  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/api/v1/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      return data.valid === true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/api/v1/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    return data as AuthResponse;
  },

  // Helper function to get stored tokens
  getStoredTokens: () => {
    if (typeof window === "undefined") return null;
    
    const accessToken = localStorage.getItem("accessTokenSite");
    const refreshToken = localStorage.getItem("refreshTokenSite");
    
    return accessToken && refreshToken ? { accessToken, refreshToken } : null;
  },

  // Helper function to save tokens
  saveTokens: (authResponse: AuthResponse) => {
    if (typeof window === "undefined") return;
    
    localStorage.setItem("accessTokenSite", authResponse.access_token);
    localStorage.setItem("refreshTokenSite", authResponse.refresh_token);
  },

  // Helper function to clear tokens
  clearTokens: () => {
    if (typeof window === "undefined") return;
    
    localStorage.removeItem("accessTokenSite");
    localStorage.removeItem("refreshTokenSite");
  },

  // Main function to check and refresh token if needed
  ensureValidToken: async (): Promise<boolean> => {
    const tokens = authService.getStoredTokens();
    if (!tokens) return false;

    try {
      // First, try to validate the current access token
      const isValid = await authService.validateToken(tokens.accessToken);
      if (isValid) return true;

      // If invalid, try to refresh using refresh token
      const refreshResponse = await authService.refreshToken(tokens.refreshToken);
      authService.saveTokens(refreshResponse);
      return true;
    } catch (error) {
      console.error("Token validation/refresh failed:", error);
      authService.clearTokens();
      return false;
    }
  },
};
