const express = require('express');
const router = express.Router();
const ownershipController = require('../controllers/ownershipController');

router.post('/assign', ownershipController.assignOwner);
router.post('/remove', ownershipController.removeOwner);
router.get('/unit/:unitId', ownershipController.getOwnersByUnit);
router.get('/party/:partyId', ownershipController.getUnitsByParty);

module.exports = router;
