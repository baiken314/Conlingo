const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');

// Routes for lessons
router.get('/', lessonController.getAllLessons);
router.post('/', lessonController.createLesson);
router.get('/:id', lessonController.getLessonById);
router.get('/:id/sentences', lessonController.getSentencesByLessonId);
router.put('/:id', lessonController.updateLesson);
router.delete('/:id', lessonController.deleteLesson);

module.exports = router;
