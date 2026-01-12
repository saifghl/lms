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

// OWNERS APIs
export const ownerAPI = {
  getOwners: () => API.get("/owners"),
  getOwnerById: (id) => API.get(`/owners/${id}`),
  createOwner: (data) => API.post("/owners", data),
  updateOwner: (id, data) => API.put(`/owners/${id}`, data),
  deleteOwner: (id) => API.delete(`/owners/${id}`),
};
// ---------------- UNITS ----------------
export const unitAPI = {
  getUnits: () => API.get("/units"),
  getUnitById: (id) => API.get(`/units/${id}`),
  createUnit: (data) => API.post("/units", data),
  updateUnit: (id, data) => API.put(`/units/${id}`, data),
  deleteUnit: (id) => API.delete(`/units/${id}`),
};
// SETTINGS//
export const settingsAPI = {
  getSettings: () => API.get("/settings"),
  updateSettings: (data) => API.put("/settings", data),
};
// ---------------- ROLES ----------------
export const roleAPI = {
  getRoles: () => API.get("/roles"),
  createRole: (data) => API.post("/roles", data),
  deleteRole: (id) => API.delete(`/roles/${id}`),
};

// Dashboard APIs
export const getDashboardStats = () => API.get("/dashboard/stats");

// Activity Log APIs
export const getActivityLogs = (page = 1, limit = 50) => 
  API.get(`/activity-logs?page=${page}&limit=${limit}`);

// Lease Management//
export const getLeaseStats = () => API.get("/leases/stats");
export const getPendingLeases = () => API.get("/leases/pending");
export const approveLease = (id) => API.put(`/leases/approve/${id}`);
export const getExpiringLeases = () => API.get("/leases/expiring");
export const getNotifications = () => API.get("/leases/notifications");


export default API;
