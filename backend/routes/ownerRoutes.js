const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');

router.get('/owners', ownerController.getOwners);
router.get('/owners/:id', ownerController.getOwnerById);
router.post('/owners', ownerController.addOwner);
router.put('/owners/:id', ownerController.updateOwner);
router.delete('/owners/:id', ownerController.deleteOwner);

module.exports = router;

