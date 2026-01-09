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
} = require('../controllers/ownerController');

router.get('/', getOwners);
router.get('/:id', getOwnerById);
router.post('/', createOwner);
router.put('/:id', updateOwner);
router.delete('/:id', deleteOwner);

router.post('/:id/units', addUnitsToOwner);
router.delete('/:id/units/:unitId', removeUnitFromOwner);

module.exports = router;
