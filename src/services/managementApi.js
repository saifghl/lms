import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/management",
});

// Dashboard
export const getDashboard = () => API.get("/dashboard");

// Reports
export const getReports = () => API.get("/reports");

// Documents
export const getDocuments = () => API.get("/documents");

// Notifications
export const getNotifications = () => API.get("/notifications");

// Search
export const searchData = () => API.get("/search");

// Profile
export const getProfile = () => API.get("/profile");
export const updateProfile = (data) => API.put("/profile", data);
