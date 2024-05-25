const Sentence = require('../models/sentence');

// Controller functions for handling CRUD operations
exports.getAllSentences = async (req, res) => {
    try {
        const sentences = await Sentence.find();
        res.json(sentences);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createSentence = async (req, res) => {
    const sentence = new Sentence({
        targetText: req.body.targetText,
        nativeText: req.body.nativeText
    });

    try {
        const newSentence = await sentence.save();
        res.status(201).json(newSentence);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getSentenceById = async (req, res) => {
    try {
        const sentence = await Sentence.findById(req.params.id);
        if (!sentence) {
            return res.status(404).json({ message: 'Sentence not found' });
        }
        res.json(sentence);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateSentence = async (req, res) => {
    try {
        const updatedSentence = await Sentence.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSentence) {
            return res.status(404).json({ message: 'Sentence not found' });
        }
        res.json(updatedSentence);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteSentence = async (req, res) => {
    try {
        const deletedSentence = await Sentence.findByIdAndDelete(req.params.id);
        if (!deletedSentence) {
            return res.status(404).json({ message: 'Sentence not found' });
        }
        res.json({ message: 'Sentence deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
