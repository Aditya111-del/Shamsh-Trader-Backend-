import { Request, Response, NextFunction } from 'express';
import { Course } from '../models/Course';

// @desc    Get all courses
// @route   GET /api/v1/courses
// @access  Public
export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course
// @route   POST /api/v1/courses
// @access  Private/Admin
export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, level, levelColor, image, meta, price, externalLink, isFlagship, includes, delay } = req.body;

    if (!title || !description || !externalLink) {
      res.status(400).json({ message: 'Title, description, and external link are required' });
      return;
    }

    const course = await Course.create({
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
  } catch (error) {
    next(error);
  }
};

// @desc    Update a course
// @route   PUT /api/v1/courses/:id
// @access  Private/Admin
export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a course
// @route   DELETE /api/v1/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } catch (error) {
    next(error);
  }
};
