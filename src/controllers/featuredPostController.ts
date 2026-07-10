import { Request, Response } from 'express';
import { FeaturedPost } from '../models/FeaturedPost';
import { z } from 'zod';

const featuredPostSchema = z.object({
  type: z.enum(['WEEKLY', 'FEATURED']),
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().optional(),
  category: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  dateText: z.string().min(1, 'Date text is required'),
  readTime: z.string().min(1, 'Read time is required'),
  externalLink: z.string().optional(),
});

// @desc    Get all featured posts
// @route   GET /api/v1/featured-posts
// @access  Public
export const getFeaturedPosts = async (req: Request, res: Response) => {
  try {
    let posts = await FeaturedPost.find();
    
    // Seed default if empty
    if (posts.length === 0) {
      posts = await FeaturedPost.insertMany([
        {
          type: 'FEATURED',
          title: 'Liquidity is thin, conviction is thinner: the summer playbook',
          excerpt: 'Why August ranges punish breakout traders — and the three setups I\'ll actually take while everyone else overtrades chop.',
          image: '/images/capability-1.jpg',
          dateText: 'July 6, 2026',
          readTime: '12 min read',
          externalLink: '#'
        },
        {
          type: 'WEEKLY',
          title: 'Weekly Report: Key levels to watch',
          excerpt: 'A deep dive into the macroeconomic shifts defining this week.',
          image: '/images/capability-2.jpg',
          dateText: 'July 10, 2026',
          readTime: '8 min read',
          externalLink: '#'
        }
      ]);
    }
    
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a featured post
// @route   PUT /api/v1/featured-posts/:type
// @access  Private/Admin
export const updateFeaturedPost = async (req: Request, res: Response) => {
  try {
    const type = String(req.params.type).toUpperCase();
    const validatedData = featuredPostSchema.parse({ ...req.body, type });

    const post = await FeaturedPost.findOneAndUpdate(
      { type: validatedData.type },
      { $set: validatedData },
      { new: true, runValidators: true, upsert: true }
    );

    res.json(post);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0].message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get a featured post by type
// @route   GET /api/v1/featured-posts/:type
// @access  Public
export const getFeaturedPostByType = async (req: Request, res: Response) => {
  try {
    const type = String(req.params.type).toUpperCase() as 'WEEKLY' | 'FEATURED';
    const post = await FeaturedPost.findOne({ type });
    if (!post) {
      return res.status(404).json({ message: 'Featured post not found' });
    }
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
