
const express = require("express");
const router = express.Router();
const lease = require("../controllers/leaseController");


router.get("/stats", lease.getLeaseStats);
router.get("/pending", lease.getPendingLeases);
router.put("/approve/:id", lease.approveLease);
router.get("/expiring", lease.getExpiringLeases);
router.get("/notifications", lease.getLeaseNotifications);


module.exports = router;

const express = require('express');
const {
    createLease,
    getAllLeases,
    getLeaseById,
    updateLease
} = require('../controllers/leaseController');

// TEMP: no auth so frontend works
router.get('/', getAllLeases);
router.post('/', createLease);
router.get('/:id', getLeaseById);
router.put('/:id', updateLease);

module.exports = router;

