const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// All routes use the upload middleware for potential image uploads
router.post('/', projectController.upload.single('image'), projectController.addProject);
router.get('/locations', projectController.getProjectLocations); // Get Unique Locations
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.get('/:id/units', projectController.getUnitsByProject); // New Route for Tenant Unit Selection
router.put('/:id', projectController.upload.single('image'), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
