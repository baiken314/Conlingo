const mongoose = require('mongoose');
const Entry = require('./entry');

const sentenceSchema = new mongoose.Schema({
    targetText: { type: String, required: true },
    nativeText: { type: String, required: true },
    acceptableTargetAnswers: { type: [String]},
    acceptableNativeAnswers: { type: [String]}
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true}
});

sentenceSchema.virtual('cleanTargetText').get(function() {
    return this.targetText.replace(/[()\[\]]/g, '');
});

sentenceSchema.virtual('cleanNativeText').get(function() {
    return this.nativeText.replace(/[()\[\]]/g, '');
});

module.exports = mongoose.model('Sentence', sentenceSchema);
