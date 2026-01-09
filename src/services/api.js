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

// Unit APIs
export const getUnits = () => API.get("/units");
export const getUnitById = (id) => API.get(`/units/${id}`);
export const addUnit = (data) => API.post("/units", data);
export const updateUnit = (id, data) => API.put(`/units/${id}`, data);
export const deleteUnit = (id) => API.delete(`/units/${id}`);

// Lease APIs
export const getLeases = () => API.get("/leases");
export const getLeaseById = (id) => API.get(`/leases/${id}`);
export const addLease = (data) => API.post("/leases", data);
export const updateLease = (id, data) => API.put(`/leases/${id}`, data);
export const deleteLease = (id) => API.delete(`/leases/${id}`);

// Tenant APIs
export const getTenants = () => API.get("/tenants");
export const getTenantById = (id) => API.get(`/tenants/${id}`);
export const addTenant = (data) => API.post("/tenants", data);
export const updateTenant = (id, data) => API.put(`/tenants/${id}`, data);
export const deleteTenant = (id) => API.delete(`/tenants/${id}`);

// Owner APIs
export const getOwners = () => API.get("/owners");
export const getOwnerById = (id) => API.get(`/owners/${id}`);
export const addOwner = (data) => API.post("/owners", data);
export const updateOwner = (id, data) => API.put(`/owners/${id}`, data);
export const deleteOwner = (id) => API.delete(`/owners/${id}`);

// Dashboard APIs
export const getDashboardStats = () => API.get("/dashboard/stats");

// Activity Log APIs
export const getActivityLogs = (page = 1, limit = 50) => 
  API.get(`/activity-logs?page=${page}&limit=${limit}`);

export default API;
