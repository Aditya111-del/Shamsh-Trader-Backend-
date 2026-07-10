import express from 'express';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = express.Router();

router.route('/')
  .get(getTestimonials)
  .post(protect, authorize(Role.ADMIN), createTestimonial);

router.route('/:id')
  .put(protect, authorize(Role.ADMIN), updateTestimonial)
  .delete(protect, authorize(Role.ADMIN), deleteTestimonial);

export default router;
