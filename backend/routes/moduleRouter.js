const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');

// Routes for modules
router.get('/', moduleController.getAllModules);
router.post('/', moduleController.createModule);
router.get('/:id', moduleController.getModuleById);
router.post('/update', moduleController.updateModule);
router.delete('/:id', moduleController.deleteModule);
router.get('/course/:courseId/modules', moduleController.getModulesByCourseId);
router.get('/:id/lessons', moduleController.getLessonsByModuleId);

module.exports = router;
