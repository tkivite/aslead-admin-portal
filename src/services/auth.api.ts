import { AuthResponse } from "@/types/api.types";

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(
      "https://gateway.itiksolutions.com/aslead/auth/api/v1/login",
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

