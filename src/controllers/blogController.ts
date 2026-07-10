import { Request, Response, NextFunction } from 'express';
import { Blog } from '../models/Blog';

// @desc    Get all blogs
// @route   GET /api/v1/blogs
// @access  Public
export const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogs = await Blog.find().populate('authorId', 'name email').sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by slug
// @route   GET /api/v1/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('authorId', 'name email');
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }
    res.json(blog);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new blog
// @route   POST /api/v1/blogs
// @access  Private/Admin
export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, excerpt, content, image, category, categoryColor, readTime, isPremium } = req.body;

    if (!title || !content || !excerpt || !image || !category) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const blogExists = await Blog.findOne({ slug });
    if (blogExists) {
      res.status(400).json({ message: 'A blog with this title already exists' });
      return;
    }

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      image,
      category,
      categoryColor: categoryColor || '#22c55e',
      readTime: readTime || '5 min read',
      isPremium: isPremium ?? false,
      authorId: req.user?._id,
    });

    const populatedBlog = await blog.populate('authorId', 'name email');
    res.status(201).json(populatedBlog);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog
// @route   PUT /api/v1/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    res.json(blog);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    await blog.deleteOne();
    res.json({ message: 'Blog removed' });
  } catch (error) {
    next(error);
  }
};
