const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');

router.get('/tenants', tenantController.getTenants);
router.get('/tenants/:id', tenantController.getTenantById);
router.post('/tenants', tenantController.addTenant);
router.put('/tenants/:id', tenantController.updateTenant);
router.delete('/tenants/:id', tenantController.deleteTenant);

module.exports = router;

