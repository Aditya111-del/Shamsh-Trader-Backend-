"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.updateTestimonial = exports.createTestimonial = exports.getTestimonials = void 0;
const Testimonial_1 = __importDefault(require("../models/Testimonial"));
// @desc    Get all testimonials
// @route   GET /api/v1/testimonials
// @access  Public
const getTestimonials = async (req, res, next) => {
    try {
        const testimonials = await Testimonial_1.default.find().sort({ createdAt: -1 });
        res.json(testimonials);
    }
    catch (error) {
        next(error);
    }
};
exports.getTestimonials = getTestimonials;
// @desc    Create a testimonial
// @route   POST /api/v1/testimonials
// @access  Private/Admin
const createTestimonial = async (req, res, next) => {
    try {
        const data = req.body;
        // Auto-generate initial if not provided
        if (!data.initial && data.name) {
            data.initial = data.name.charAt(0).toUpperCase();
        }
        const testimonial = await Testimonial_1.default.create(data);
        res.status(201).json(testimonial);
    }
    catch (error) {
        next(error);
    }
};
exports.createTestimonial = createTestimonial;
// @desc    Update a testimonial
// @route   PUT /api/v1/testimonials/:id
// @access  Private/Admin
const updateTestimonial = async (req, res, next) => {
    try {
        const data = req.body;
        // Auto-generate initial if not provided
        if (!data.initial && data.name) {
            data.initial = data.name.charAt(0).toUpperCase();
        }
        const testimonial = await Testimonial_1.default.findByIdAndUpdate(req.params.id, data, {
            new: true,
            runValidators: true,
        });
        if (!testimonial) {
            res.status(404).json({ message: 'Testimonial not found' });
            return;
        }
        res.json(testimonial);
    }
    catch (error) {
        next(error);
    }
};
exports.updateTestimonial = updateTestimonial;
// @desc    Delete a testimonial
// @route   DELETE /api/v1/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial_1.default.findByIdAndDelete(req.params.id);
        if (!testimonial) {
            res.status(404).json({ message: 'Testimonial not found' });
            return;
        }
        res.json({ message: 'Testimonial removed' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTestimonial = deleteTestimonial;
