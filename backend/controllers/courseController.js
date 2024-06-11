const Course = require('../models/course');
const Module = require('../models/module');

// Controller functions for handling CRUD operations
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('modules').populate('createdBy', 'username');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCourse = async (req, res) => {
    const course = new Course({
        name: req.body.name,
        description: req.body.description,
        createdBy: req.body.userId
    });

    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate({
            path: 'modules',
            populate: {
                path: 'lessons',
                populate: [
                    { path: 'keywords' },
                    { path: 'sentences' }
                ]
            }
        });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateCourse = async (req, res) => {
    console.log('/POST courses/update', req.body);
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.body._id, req.body, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(updatedCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addModuleToCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const module = new Module({
            name: 'New module',
            description: 'Description here'
        });
        await module.save();

        course.modules.push(module);
        await course.save();

        res.status(201).json(course);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.removeModuleFromCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const moduleId = req.params.moduleId;
        course.modules = course.modules.filter(module => module != moduleId);
        await course.save();

        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
