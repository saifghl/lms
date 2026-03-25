const express = require('express');
const router = express.Router();
const filterOptionsController = require('../controllers/filterOptionsController');

router.get('/', filterOptionsController.getFilterOptions);
router.post('/', filterOptionsController.addFilterOption);
router.delete('/:id', filterOptionsController.deleteFilterOption);

module.exports = router;
