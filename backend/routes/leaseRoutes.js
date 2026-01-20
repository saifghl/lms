const express = require("express");
const router = express.Router();
const leaseController = require("../controllers/leaseController");

// Stats & Dashboard
router.get("/stats", leaseController.getLeaseDashboardStats);
router.get("/pending", leaseController.getPendingLeases);
router.get("/expiring", leaseController.getExpiringLeases);
router.get("/notifications", leaseController.getLeaseNotifications);
router.put("/approve/:id", leaseController.approveLease);

// CRUD
router.get("/", leaseController.getAllLeases);
router.post("/", leaseController.createLease);
router.get("/:id", leaseController.getLeaseById);
router.put("/:id", leaseController.updateLease);

module.exports = router;
