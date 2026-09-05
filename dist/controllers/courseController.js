"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourses = void 0;
const Course_1 = require("../models/Course");
// @desc    Get all courses
// @route   GET /api/v1/courses
// @access  Public
const getCourses = async (req, res, next) => {
    try {
        const courses = await Course_1.Course.find().sort({ createdAt: -1 });
        res.json(courses);
    }
    catch (error) {
        next(error);
    }
};
exports.getCourses = getCourses;
// @desc    Create a new course
// @route   POST /api/v1/courses
// @access  Private/Admin
const createCourse = async (req, res, next) => {
    try {
        const { title, description, level, levelColor, image, meta, price, externalLink, isFlagship, includes, delay } = req.body;
        if (!title || !description || !externalLink) {
            res.status(400).json({ message: 'Title, description, and external link are required' });
            return;
        }
        const course = await Course_1.Course.create({
            title,
            description,
            level: level || 'Beginner',
            levelColor: levelColor || '#22c55e',
            image: image || '',
            meta: meta || '',
            price: price || 'Free',
            externalLink,
            isFlagship: isFlagship || false,
            includes: includes || [],
            delay: delay || 0,
        });
        res.status(201).json(course);
    }
    catch (error) {
        next(error);
    }
};
exports.createCourse = createCourse;
// @desc    Update a course
// @route   PUT /api/v1/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res, next) => {
    try {
        const course = await Course_1.Course.findById(req.params.id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        const updatedCourse = await Course_1.Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(updatedCourse);
    }
    catch (error) {
        next(error);
    }
};
exports.updateCourse = updateCourse;
// @desc    Delete a course
// @route   DELETE /api/v1/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res, next) => {
    try {
        const course = await Course_1.Course.findById(req.params.id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        await course.deleteOne();
        res.json({ message: 'Course removed' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCourse = deleteCourse;
