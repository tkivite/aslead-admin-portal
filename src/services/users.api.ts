import api from "./api";
import { UserCreateRequest } from "@/types/users.types";
// Users services
export const usersService = {
  getUsers: async (page = 0, size = 10) => {
    const response = await api.get(`/api/v1/users?page=${page}&size=${size}`);
    return response.data;
  },

  createUser: async (userData: UserCreateRequest) => {
    const response = await api.post("/api/v1//users", userData);
    return response.data;
  },

  updateUser: async (userId: number, userData: Partial<UserCreateRequest>) => {
    const response = await api.put(`/api/v1//users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const response = await api.delete(`/api/v1/users/${userId}`);
    return response.data;
  },
};