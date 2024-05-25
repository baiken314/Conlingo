const Entry = require('../models/entry');

// Controller functions for handling CRUD operations
exports.createEntry = async (req, res) => {
    const { entry, partOfSpeech, translation, picture, audio, root, courseId } = req.body;

    try {
        // Check if courseId exists
        if (courseId) {
            // Check if the course exists
            const courseExists = await Course.exists({ _id: courseId });
            if (!courseExists) {
                return res.status(404).json({ message: 'Course not found' });
            }
        }

        const newEntry = new Entry({
            entry,
            partOfSpeech,
            translation,
            picture,
            audio,
            root,
            course: courseId
        });

        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await Entry.find();
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getEntryById = async (req, res) => {
    try {
        const entry = await Entry.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json(entry);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getEntriesByCourseId = async (req, res) => {
    try {
        const entries = await Entry.find({ course: req.params.courseId });
        if (!entries) {
            return res.status(404).json({ message: 'Entries not found' });
        }
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json(updatedEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const deletedEntry = await Entry.findByIdAndDelete(req.params.id);
        if (!deletedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json({ message: 'Entry deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
