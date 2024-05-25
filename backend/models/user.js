const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    moduleProgress: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    lessonProgress: [{
        lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        completed: { type: Boolean, default: false }
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;