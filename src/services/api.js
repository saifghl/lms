import axios from "axios";

const getBaseUrl = () => {
  let url = process.env.REACT_APP_API_URL || "http://localhost:5000";
  // Remove trailing slash if present to avoid double slashes later
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const FILE_BASE_URL = getBaseUrl();

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://backend1-ls90.onrender.com/"
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
  getKycStats: () => API.get("/owners/stats"), // New stats API
  exportOwners: () => API.get("/owners/export", { responseType: 'blob' }),
  getOwnerById: (id) => API.get(`/owners/${id}`),
  createOwner: (data) => API.post("/owners", data),
  updateOwner: (id, data) => API.put(`/owners/${id}`, data),
  deleteOwner: (id) => API.delete(`/owners/${id}`),
};

// ---------------- UNITS ----------------
export const unitAPI = {
  getUnits: () => API.get("/units"),
  getUnitById: (id) => API.get(`/units/${id}`),
  createUnit: (data) => API.post("/units", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  updateUnit: (id, data) => API.put(`/units/${id}`, data),
  deleteUnit: (id) => API.delete(`/units/${id}`),
  getUnitsByProject: (projectId) => API.get(`/units?projectId=${projectId}`),
};

// ---------------- TENANTS ----------------
export const tenantAPI = {
  getTenants: () => API.get("/tenants"),
  getTenantById: (id) => API.get(`/tenants/${id}`),
  createTenant: (data) => API.post("/tenants", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  updateTenant: (id, data) => API.put(`/tenants/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  deleteTenant: (id) => API.delete(`/tenants/${id}`),
};

// SETTINGS
export const settingsAPI = {
  getSettings: () => API.get("/settings"),
  updateSettings: (data) => API.put("/settings", data),
  uploadPhoto: (id, data) => API.post(`/settings/${id}/photo`, data),
  removePhoto: (id) => API.delete(`/settings/${id}/photo`),
  updatePassword: (id, data) => API.put(`/settings/${id}/password`, data),
};

// ---------------- ROLES ----------------
export const roleAPI = {
  getRoles: () => API.get("/roles"),
  createRole: (data) => API.post("/roles", data),
  deleteRole: (id) => API.delete(`/roles/${id}`),
};

// ---------------- USERS ----------------
export const userAPI = {
  getUsers: () => API.get("/users"),
  createUser: (data) => API.post("/users", data),
  updateUser: (id, data) => API.put(`/users/${id}`, data),
  deleteUser: (id) => API.delete(`/users/${id}`),
};

// ---------------- MANAGEMENT REP ----------------
export const managementAPI = {
  getDashboardStats: () => API.get("/management/dashboard"),
  getReports: (params) => API.get("/management/reports", { params }),
  exportReports: (params) => API.get("/management/reports/export", { params, responseType: 'blob' }),
  getDocuments: (params) => API.get("/management/documents", { params }),
  getNotifications: (params) => API.get("/management/notifications", { params }),
  uploadDocument: (data) => API.post("/management/documents", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
};

// Dashboard APIs
export const getDashboardStats = () => API.get("/dashboard/stats");

// Activity Log APIs
// Activity Log APIs
export const getActivityLogs = (page = 1, limit = 50, filters = {}) => {
  const query = new URLSearchParams({ page, limit, ...filters }).toString();
  return API.get(`/activity/activity-logs?${query}`);
};

export const exportActivityLogs = (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return API.get(`/activity/export?${query}`, { responseType: 'blob' });
};

// Lease Management
export const leaseAPI = {
  getAllLeases: (params) => API.get("/leases", { params }),
  getLeaseById: (id) => API.get(`/leases/${id}`),
  createLease: (data) => API.post("/leases", data),
  updateLease: (id, data) => API.put(`/leases/${id}`, data),
  getStats: () => API.get("/leases/stats"),
  getPending: () => API.get("/leases/pending"),
  getExpiring: () => API.get("/leases/expiring"),
  getNotifications: () => API.get("/leases/notifications"),
  approveLease: (id) => API.put(`/leases/approve/${id}`),
};

// Backwards compatibility for existing components
export const getLeaseStats = leaseAPI.getStats;
export const getPendingLeases = leaseAPI.getPending;
export const getExpiringLeases = leaseAPI.getExpiring;
export const getNotifications = leaseAPI.getNotifications;
export const approveLease = leaseAPI.approveLease;

export default API;
