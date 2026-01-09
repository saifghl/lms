const express = require("express");
const router = express.Router();
const lease = require("../controllers/leaseController");


router.get("/stats", lease.getLeaseStats);
router.get("/pending", lease.getPendingLeases);
router.put("/approve/:id", lease.approveLease);
router.get("/expiring", lease.getExpiringLeases);
router.get("/notifications", lease.getLeaseNotifications);


module.exports = router;