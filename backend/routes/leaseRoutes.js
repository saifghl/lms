const express = require('express');
const router = express.Router();
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
