import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ================= OWNERS ================= */
export const ownerAPI = {
  getAll: () => API.get("/owners"),
  getById: (id) => API.get(`/owners/${id}`),
  create: (data) => API.post("/owners", data),
  update: (id, data) => API.put(`/owners/${id}`, data),
  delete: (id) => API.delete(`/owners/${id}`), // ✅ THIS FIXES DELETE
};

/* ================= UNITS ================= */
export const unitAPI = {
  getAll: () => API.get("/units"),

  getById: (id) => API.get(`/units/${id}`),   // ✅ ADD THIS

  update: (id, data) => API.put(`/units/${id}`, data),
};

/* ================= SETTINGS ================= */
export const settingsAPI = {
  get: (id) => API.get(`/settings/${id}`),
  update: (id, data) => API.put(`/settings/${id}`, data),

  uploadPhoto: (id, data) =>
    API.post(`/settings/${id}/photo`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    }),

  removePhoto: (id) =>
    API.delete(`/settings/${id}/photo`),

  updatePassword: (id, data) =>
    API.put(`/settings/${id}/password`, data),
};





/* ================= ROLES ================= */
export const roleAPI = {
  getAll: () => API.get("/roles"),
  create: (data) => API.post("/roles", data),
  update: (id, data) => API.put(`/roles/${id}`, data),
  delete: (id) => API.delete(`/roles/${id}`),
};

export default API;
