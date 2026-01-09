const express = require("express");
const router = express.Router();
const {
  getRepDashboardStats,
  getRepReports,
  getRepNotifications,
  getDocuments,
  uploadDocument
} = require("../controllers/managementRepController");

router.get("/management/dashboard/stats", getRepDashboardStats);
router.get("/management/reports", getRepReports);
router.get("/management/notifications", getRepNotifications);
router.get("/management/documents", getDocuments);
router.post("/management/documents", uploadDocument);

module.exports = router;

