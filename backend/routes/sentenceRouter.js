const express = require('express');
const router = express.Router();
const sentenceController = require('../controllers/sentenceController');

// Routes for CRUD operations
router.get('/', sentenceController.getAllSentences);
router.post('/', sentenceController.createSentence);
router.get('/:id', sentenceController.getSentenceById);
router.put('/:id', sentenceController.updateSentence);
router.delete('/:id', sentenceController.deleteSentence);

module.exports = router;
