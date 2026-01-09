const express = require('express');
const router = express.Router();

const {
    createTenant,
    getAllTenants,
    getTenantById,
    updateTenant
} = require('../controllers/tenantController');

// TEMP: no auth so frontend works
router.get('/', getAllTenants);
router.post('/', createTenant);
router.get('/:id', getTenantById);
router.put('/:id', updateTenant);

module.exports = router;
