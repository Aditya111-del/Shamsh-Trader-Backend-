import express from 'express';
import { getFeaturedPosts, updateFeaturedPost, getFeaturedPostByType } from '../controllers/featuredPostController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = express.Router();

router.route('/')
  .get(getFeaturedPosts);

router.route('/:type')
  .get(getFeaturedPostByType)
  .put(protect, authorize(Role.ADMIN), updateFeaturedPost);

export default router;
