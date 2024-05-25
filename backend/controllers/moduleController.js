const Course = require('../models/course');
const Module = require('../models/module');
const Lesson = require('../models/lesson');

// Controller functions for handling CRUD operations on modules
exports.getAllModules = async (req, res) => {
    try {
        const modules = await Module.find();
        res.json(modules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createModule = async (req, res) => {
    const module = new Module({
        name: req.body.name,
        description: req.body.description,
        order: req.body.order,
    });

    try {
        const newModule = await module.save();
        res.status(201).json(newModule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getModuleById = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }
        res.json(module);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateModule = async (req, res) => {
    try {
        const updatedModule = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedModule) {
            return res.status(404).json({ message: 'Module not found' });
        }
        res.json(updatedModule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteModule = async (req, res) => {
    try {
        const deletedModule = await Module.findByIdAndDelete(req.params.id);
        if (!deletedModule) {
            return res.status(404).json({ message: 'Module not found' });
        }
        res.json({ message: 'Module deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getModulesByCourseId = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        // Find the course by its ID
        const course = await Course.findById(courseId);

        // If the course doesn't exist, return an error
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Fetch modules associated with the course
        const modules = await Module.find({ _id: { $in: course.modules } });

        res.json(modules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLessonsByModuleId = async (req, res) => {
    try {
        const moduleId = req.params.id;
        // Find the module by its ID
        const module = await Module.findById(moduleId);
        // If the module doesn't exist, return an error
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }
        // Fetch lessons associated with the module
        const lessons = await Lesson.find({ _id: { $in: module.lessons } });
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};