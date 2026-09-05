"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeaturedPostByType = exports.updateFeaturedPost = exports.getFeaturedPosts = void 0;
const FeaturedPost_1 = require("../models/FeaturedPost");
const zod_1 = require("zod");
const featuredPostSchema = zod_1.z.object({
    type: zod_1.z.enum(['WEEKLY', 'FEATURED']),
    title: zod_1.z.string().min(1, 'Title is required'),
    excerpt: zod_1.z.string().min(1, 'Excerpt is required'),
    content: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    image: zod_1.z.string().min(1, 'Image is required'),
    dateText: zod_1.z.string().min(1, 'Date text is required'),
    readTime: zod_1.z.string().min(1, 'Read time is required'),
    externalLink: zod_1.z.string().optional(),
});
// @desc    Get all featured posts
// @route   GET /api/v1/featured-posts
// @access  Public
const getFeaturedPosts = async (req, res) => {
    try {
        let posts = await FeaturedPost_1.FeaturedPost.find();
        // Seed default if empty
        if (posts.length === 0) {
            posts = await FeaturedPost_1.FeaturedPost.insertMany([
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getFeaturedPosts = getFeaturedPosts;
// @desc    Update a featured post
// @route   PUT /api/v1/featured-posts/:type
// @access  Private/Admin
const updateFeaturedPost = async (req, res) => {
    try {
        const type = String(req.params.type).toUpperCase();
        const validatedData = featuredPostSchema.parse({ ...req.body, type });
        const post = await FeaturedPost_1.FeaturedPost.findOneAndUpdate({ type: validatedData.type }, { $set: validatedData }, { new: true, runValidators: true, upsert: true });
        res.json(post);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: error.issues[0].message });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    }
};
exports.updateFeaturedPost = updateFeaturedPost;
// @desc    Get a featured post by type
// @route   GET /api/v1/featured-posts/:type
// @access  Public
const getFeaturedPostByType = async (req, res) => {
    try {
        const type = String(req.params.type).toUpperCase();
        const post = await FeaturedPost_1.FeaturedPost.findOne({ type });
        if (!post) {
            return res.status(404).json({ message: 'Featured post not found' });
        }
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getFeaturedPostByType = getFeaturedPostByType;
