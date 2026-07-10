import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Admin-only routes
router.post('/', protect, authorize(Role.ADMIN), createEvent);
router.put('/:id', protect, authorize(Role.ADMIN), updateEvent);
router.delete('/:id', protect, authorize(Role.ADMIN), deleteEvent);

export default router;
