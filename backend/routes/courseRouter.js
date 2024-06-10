const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/', courseController.getAllCourses);
router.post('/', courseController.createCourse);
router.get('/:id', courseController.getCourseById);
router.post('/update', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.post('/:courseId/addModule', courseController.addModuleToCourse);
router.delete('/:courseId/modules/:moduleId', courseController.removeModuleFromCourse);

module.exports = router;
