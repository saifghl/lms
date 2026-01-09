import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api"
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);

// Project APIs
export const getProjects = () => API.get("/projects");
export const getProjectById = (id) => API.get(`/projects/${id}`);
export const addProject = (data) => API.post("/projects", data, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const updateProject = (id, data) => API.put(`/projects/${id}`, data, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const deleteProject = (id) => API.delete(`/projects/${id}`);


// Dashboard APIs
export const getDashboardStats = () => API.get("/dashboard/stats");

// Activity Log APIs
export const getActivityLogs = (page = 1, limit = 50) => 
  API.get(`/activity-logs?page=${page}&limit=${limit}`);

// Management Rep API
//export const getRepDashboardStats = () => api.get('/management/dashboard/stats');
//export const getRepReports = (params = {}) => api.get('/management/reports', { params });
//export const getRepNotifications = (params = {}) => api.get('/management/notifications', { params });
//export const getDocuments = (params = {}) => api.get('/management/documents', { params });
//export const uploadDocument = (data) => api.post('/management/documents', data);


export default API;
