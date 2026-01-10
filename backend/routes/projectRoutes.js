const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// All routes use the upload middleware for potential image uploads
router.post('/projects', projectController.upload.single('image'), projectController.addProject);
router.get('/projects', projectController.getProjects);
router.get('/projects/:id', projectController.getProjectById);
router.put('/projects/:id', projectController.upload.single('image'), projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

module.exports = router;
