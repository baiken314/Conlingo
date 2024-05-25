const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Course', courseSchema);
