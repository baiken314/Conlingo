const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    order: { type: String },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
});

module.exports = mongoose.model('Module', moduleSchema);
