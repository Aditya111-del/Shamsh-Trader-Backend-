import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController';

const router = Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);

router.post('/', protect, authorize(Role.ADMIN), createBlog);
router.put('/:id', protect, authorize(Role.ADMIN), updateBlog);
router.delete('/:id', protect, authorize(Role.ADMIN), deleteBlog);

export default router;
