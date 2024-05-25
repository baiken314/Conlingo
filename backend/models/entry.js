const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    entry: { type: String, required: true },
    partOfSpeech: { type: String },
    translation: { type: String },
    picture: { type: String },
    audio: { type: String },
    root: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
});

entrySchema.virtual('lowerCaseEntry').get(function() {
    return this.entry.toLowerCase();
});

module.exports = mongoose.model('Entry', entrySchema);
