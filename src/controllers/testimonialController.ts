import { Request, Response, NextFunction } from 'express';
import Testimonial from '../models/Testimonial';

// @desc    Get all testimonials
// @route   GET /api/v1/testimonials
// @access  Public
export const getTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a testimonial
// @route   POST /api/v1/testimonials
// @access  Private/Admin
export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    // Auto-generate initial if not provided
    if (!data.initial && data.name) {
      data.initial = data.name.charAt(0).toUpperCase();
    }
    const testimonial = await Testimonial.create(data);
    res.status(201).json(testimonial);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a testimonial
// @route   PUT /api/v1/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    // Auto-generate initial if not provided
    if (!data.initial && data.name) {
      data.initial = data.name.charAt(0).toUpperCase();
    }
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) {
      res.status(404).json({ message: 'Testimonial not found' });
      return;
    }
    res.json(testimonial);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/v1/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      res.status(404).json({ message: 'Testimonial not found' });
      return;
    }
    res.json({ message: 'Testimonial removed' });
  } catch (error) {
    next(error);
  }
};
