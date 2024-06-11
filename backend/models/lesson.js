const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    keywords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Entry'}],
    sentences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sentence' }]
});

module.exports = mongoose.model('Lesson', lessonSchema);
