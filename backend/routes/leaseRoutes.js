const express = require("express");
const router = express.Router();
const leaseController = require("../controllers/leaseController");

// Stats & Dashboard
router.get("/stats", leaseController.getLeaseDashboardStats);
router.get("/manager-stats", leaseController.getLeaseManagerStats);
router.get("/pending", leaseController.getPendingLeases);
router.get("/expiring", leaseController.getExpiringLeases);
router.get("/notifications", leaseController.getLeaseNotifications);
router.put("/approve/:id", leaseController.approveLease);
router.put("/reject/:id", leaseController.rejectLease);
router.post("/reminders/send", leaseController.sendLeaseReminder);
router.put("/notifications/read-all", leaseController.markAllNotificationsRead);
router.delete("/notifications", leaseController.deleteAllNotifications);

// CRUD
router.get("/", leaseController.getAllLeases);
router.post("/", leaseController.createLease);
router.get("/:id", leaseController.getLeaseById);
router.put("/:id", leaseController.updateLease);

module.exports = router;
