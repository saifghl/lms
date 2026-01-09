const express = require('express');
const router = express.Router();
const leaseController = require('../controllers/leaseController');

router.get('/leases', leaseController.getLeases);
router.get('/leases/:id', leaseController.getLeaseById);
router.post('/leases', leaseController.addLease);
router.put('/leases/:id', leaseController.updateLease);
router.delete('/leases/:id', leaseController.deleteLease);

module.exports = router;

