import express from 'express';
import { getPosts, createPost, updatePost, deletePost, fetchYouTubeMeta } from '../controllers/communityController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = express.Router();

router.route('/yt-meta')
  .get(protect, authorize(Role.ADMIN), fetchYouTubeMeta);

router.route('/')
  .get(getPosts)
  .post(protect, authorize(Role.ADMIN), createPost);

router.route('/:id')
  .put(protect, authorize(Role.ADMIN), updatePost)
  .delete(protect, authorize(Role.ADMIN), deletePost);

export default router;
