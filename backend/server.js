const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Database
const pool = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const leaseRoutes = require("./routes/leaseRoutes");
const managementRoutes = require("./routes/managementRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const unitRoutes = require("./routes/unitRoutes");
const userRoutes = require("./routes/userRoutes"); // New Route

const roleRoutes = require("./routes/roleRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

/* =========================
   DATABASE CHECK
========================= */
pool.getConnection()
  .then((connection) => {
    console.log("✅ Database connected successfully!");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

/* =========================
   ROOT ROUTE (IMPORTANT)
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend API is running 🚀"
  });
});

/* =========================
   API ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/leases", leaseRoutes);
app.use("/api/owners", ownerRoutes); // Updated Owner Route
app.use("/api/management", managementRoutes); // Management Rep Routes
// app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/roles", roleRoutes); // Mounted Route
app.use("/api/dashboard", dashboardRoutes);

/* =========================
   HEALTH CHECK (RENDER)
========================= */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server health check passed ✅"
  });
});

/* =========================
   SERVER START
========================= */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);

});
  
