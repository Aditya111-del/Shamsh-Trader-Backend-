import express from 'express';
import { getBots, createBot, updateBot, deleteBot } from '../controllers/botController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = express.Router();

router.route('/')
  .get(getBots)
  .post(protect, authorize(Role.ADMIN), createBot);

router.route('/:id')
  .put(protect, authorize(Role.ADMIN), updateBot)
  .delete(protect, authorize(Role.ADMIN), deleteBot);

export default router;
