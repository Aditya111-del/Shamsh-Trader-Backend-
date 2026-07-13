import { Request, Response, NextFunction } from 'express';
import CommunityPost from '../models/CommunityPost';

// @desc    Get all community posts
// @route   GET /api/v1/community
// @access  Public
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a community post
// @route   POST /api/v1/community
// @access  Private/Admin
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await CommunityPost.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a community post
// @route   PUT /api/v1/community/:id
// @access  Private/Admin
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a community post
// @route   DELETE /api/v1/community/:id
// @access  Private/Admin
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await CommunityPost.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json({ message: 'Post removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch YouTube Meta
// @route   GET /api/v1/community/yt-meta
// @access  Private/Admin
export const fetchYouTubeMeta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const url = req.query.url as string;
    if (!url) {
      res.status(400).json({ message: 'URL is required' });
      return;
    }

    const response = await fetch(url);
    const html = await response.text();

    let title = '';
    let duration = '';
    let image = '';
    let views = '';

    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(' - YouTube', '').trim();
    }

    // Attempt to extract duration from lengthSeconds
    const lengthMatch = html.match(/"lengthSeconds":"(\d+)"/);
    if (lengthMatch && lengthMatch[1]) {
      const seconds = parseInt(lengthMatch[1]);
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      if (hrs > 0) {
        duration = `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      } else {
        duration = `${mins}:${secs.toString().padStart(2, '0')}`;
      }
    }

    const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (ogImageMatch && ogImageMatch[1]) {
      image = ogImageMatch[1];
    }

    const viewCountMatch = html.match(/"viewCount":"(\d+)"/);
    if (viewCountMatch && viewCountMatch[1]) {
      const count = parseInt(viewCountMatch[1]);
      if (count >= 1000000) {
        views = (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M views';
      } else if (count >= 1000) {
        views = (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K views';
      } else {
        views = count + ' views';
      }
    }

    res.json({ title, duration, image, views });
  } catch (error) {
    console.error('Error fetching YouTube meta:', error);
    res.status(500).json({ message: 'Failed to fetch meta' });
  }
};
