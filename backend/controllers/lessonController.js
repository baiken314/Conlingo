const Entry = require('../models/entry');
const Lesson = require('../models/lesson');

// Controller functions for handling CRUD operations on lessons
exports.getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createLesson = async (req, res) => {
    const lesson = new Lesson();

    try {
        const newLesson = await lesson.save();
        res.status(201).json(newLesson);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.json(lesson);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateLesson = async (req, res) => {
    try {
        const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.json(updatedLesson);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteLesson = async (req, res) => {
    try {
        const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
        if (!deletedLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.json({ message: 'Lesson deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSentencesByLessonId = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate({
            path: 'sentences',
            options: { virtuals: true }
        });

        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

        let lessonObj = JSON.parse(JSON.stringify(lesson));

        for (let i = 0; i < lesson.sentences.length; i++) {
            const hoverWords = await getHoverWords(lessonObj.sentences[i]);
            lessonObj.sentences[i].targetHoverWords = hoverWords.targetHoverWords;
            lessonObj.sentences[i].nativeHoverWords = hoverWords.nativeHoverWords;
        }

        res.json(lessonObj.sentences);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getHoverWords = async (sentence) => {
    let targetHoverWords = {};
    let nativeHoverWords = {};
    let targetEntryWords = getWordsFromText(sentence.targetText);
    let nativeEntryWords = getWordsFromText(sentence.nativeText);

    for (let targetEntryWord of targetEntryWords) {
        let searchEntryWord = targetEntryWord.replace(/[.,?:!;'"-]/g, '').toLowerCase();
        let entry = await Entry.findOne({ entry: { $regex: `^${searchEntryWord}$`, $options: 'i' } });

        if (entry) {
            while (entry.root) {
                entry = await Entry.findById(entry.root);
            }
            targetHoverWords[targetEntryWord] = entry.translation;
        } else {
            targetHoverWords[targetEntryWord] = "N/A";
        }
    }

    for (let nativeEntryWord of nativeEntryWords) {
        let searchEntryWord = nativeEntryWord.replace(/[.,?:!;'"-]/g, '').toLowerCase();
        let entry = await Entry.findOne({ translation: { $regex: `^${searchEntryWord}$`, $options: 'i' } });

        if (entry) {
            while (entry.root) {
                entry = await Entry.findById(entry.root);
            }
            nativeHoverWords[nativeEntryWord] = entry.entry;
        } else {
            nativeHoverWords[nativeEntryWord] = "N/A";
        }
    }

    return {
        targetHoverWords: targetHoverWords,
        nativeHoverWords: nativeHoverWords
    };
};

// break up targetText into words... parenthetic expressions are words
const getWordsFromText = (text) => {
    const words = [];
    let currentWord = '';
    let inParentheses = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === '(') {
            inParentheses = true;
        } else if (char === ')') {
            inParentheses = false;
            words.push(currentWord);
            currentWord = '';
        } else if (char === ' ' && !inParentheses) {
            if (currentWord !== '') {
                words.push(currentWord);
                currentWord = '';
            }
        } else {
            currentWord += char;
        }
    }

    if (currentWord !== '') {
        words.push(currentWord);
    }

    return words;
};