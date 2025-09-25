import axios from "axios";

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

export default api;
