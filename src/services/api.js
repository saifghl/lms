import axios from "axios";

/**
 * Base API URL
 * Local  : http://localhost:5000/api
 * Render : https://lms-l7qm.onrender.com/api
 */
const getBaseUrl = () => {
  let url =
    process.env.REACT_APP_API_URL ||
    "https://lms-l7qm.onrender.com/api";

  // Remove trailing slash
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

export const FILE_BASE_URL = getBaseUrl();

const API = axios.create({
  baseURL: getBaseUrl(),
});

// ---------------- TOKEN INTERCEPTOR ----------------
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- ERROR INTERCEPTOR ----------------
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// ---------------- AUTH ----------------
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);

// ---------------- PROJECTS ----------------
export const getProjects = (params) => API.get("/projects", { params });
export const getProjectById = (id) => API.get(`/projects/${id}`);
export const addProject = (data) =>
  API.post("/projects", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateProject = (id, data) =>
  API.put(`/projects/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteProject = (id) =>
  API.delete(`/projects/${id}`);

// ---------------- OWNERS ----------------
export const ownerAPI = {
  getOwners: (params) => API.get("/owners", { params }),
  getKycStats: () => API.get("/owners/stats"),
  exportOwners: () =>
    API.get("/owners/export", { responseType: "blob" }),
  getOwnerById: (id) => API.get(`/owners/${id}`),
  createOwner: (data) => API.post("/owners", data),
  updateOwner: (id, data) => API.put(`/owners/${id}`, data),
  deleteOwner: (id) => API.delete(`/owners/${id}`),
};

// ---------------- UNITS ----------------
export const unitAPI = {
  getUnits: () => API.get("/units"),
  getUnitById: (id) => API.get(`/units/${id}`),
  createUnit: (data) =>
    API.post("/units", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateUnit: (id, data) => API.put(`/units/${id}`, data),
  deleteUnit: (id) => API.delete(`/units/${id}`),
  getUnitsByProject: (projectId) =>
    API.get(`/units?projectId=${projectId}`),
};

// ---------------- TENANTS ----------------
export const tenantAPI = {
  getTenants: (params) => API.get("/tenants", { params }),
  getTenantById: (id) => API.get(`/tenants/${id}`),
  createTenant: (data) => API.post("/tenants", data),
  updateTenant: (id, data) =>
    API.put(`/tenants/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteTenant: (id) => API.delete(`/tenants/${id}`),
};

// ---------------- SETTINGS ----------------
export const settingsAPI = {
  getSettings: () => API.get("/settings"),
  updateSettings: (data) => API.put("/settings", data),
  uploadPhoto: (id, data) =>
    API.post(`/settings/${id}/photo`, data),
  removePhoto: (id) =>
    API.delete(`/settings/${id}/photo`),
  updatePassword: (id, data) =>
    API.put(`/settings/${id}/password`, data),
};

// ---------------- ROLES ----------------
export const roleAPI = {
  getRoles: () => API.get("/roles"),
  createRole: (data) => API.post("/roles", data),
  deleteRole: (id) => API.delete(`/roles/${id}`),
};

// ---------------- USERS ----------------
export const userAPI = {
  getUsers: (params) => API.get("/users", { params }),
  createUser: (data) => API.post("/users", data),
  updateUser: (id, data) => API.put(`/users/${id}`, data),
  deleteUser: (id) => API.delete(`/users/${id}`),
};

// ---------------- MANAGEMENT ----------------
export const managementAPI = {
  getDashboardStats: () =>
    API.get("/management/dashboard"),
  getReports: (params) =>
    API.get("/management/reports", { params }),
  exportReports: (params) =>
    API.get("/management/reports/export", {
      params,
      responseType: "blob",
    }),
  getDocuments: (params) =>
    API.get("/management/documents", { params }),
  getNotifications: (params) =>
    API.get("/management/notifications", { params }),
  uploadDocument: (data) =>
    API.post("/management/documents", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ---------------- DASHBOARD ----------------
export const getDashboardStats = () =>
  API.get("/dashboard/stats");

// ---------------- ACTIVITY LOG ----------------
export const getActivityLogs = (
  page = 1,
  limit = 50,
  filters = {}
) => {
  const query = new URLSearchParams({
    page,
    limit,
    ...filters,
  }).toString();
  return API.get(`/activity/activity-logs?${query}`);
};

export const exportActivityLogs = (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return API.get(`/activity/export?${query}`, {
    responseType: "blob",
  });
};

// ---------------- LEASE ----------------
export const leaseAPI = {
  getAllLeases: (params) =>
    API.get("/leases", { params }),
  getLeaseById: (id) =>
    API.get(`/leases/${id}`),
  createLease: (data) =>
    API.post("/leases", data),
  updateLease: (id, data) =>
    API.put(`/leases/${id}`, data),
  getStats: () => API.get("/leases/stats"),
  getPending: () => API.get("/leases/pending"),
  getExpiring: () => API.get("/leases/expiring"),
  getNotifications: () =>
    API.get("/leases/notifications"),
  approveLease: (id) =>
    API.put(`/leases/approve/${id}`),
};

// Backward compatibility
export const getLeaseStats = leaseAPI.getStats;
export const getPendingLeases = leaseAPI.getPending;
export const getExpiringLeases = leaseAPI.getExpiring;
export const getNotifications = leaseAPI.getNotifications;
export const approveLease = leaseAPI.approveLease;

export default API;
