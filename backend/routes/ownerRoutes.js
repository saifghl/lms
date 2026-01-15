const express = require('express');
const router = express.Router();

const {
    getOwners,
    getOwnerById,
    createOwner,
    updateOwner,
    deleteOwner,
    addUnitsToOwner,
    removeUnitFromOwner,
    exportOwners,
    getKycStats, // Import new controller
} = require('../controllers/ownerController');

router.get('/export', exportOwners);
router.get('/stats', getKycStats); // New stats route (Must be before /:id)
router.get('/', getOwners);
router.get('/:id', getOwnerById);
router.post('/', createOwner);
router.put('/:id', updateOwner);
router.delete('/:id', deleteOwner);

router.post('/:id/units', addUnitsToOwner);
router.delete('/:id/units/:unitId', removeUnitFromOwner);

module.exports = router;
