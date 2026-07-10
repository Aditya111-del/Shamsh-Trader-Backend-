import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = express.Router();

router.route('/')
  .get(getSettings)
  .put(protect, authorize(Role.ADMIN), updateSettings);

export default router;
