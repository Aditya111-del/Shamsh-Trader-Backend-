import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../controllers/courseController';

const router = Router();

router.get('/', getCourses);

router.post('/', protect, authorize(Role.ADMIN), createCourse);
router.put('/:id', protect, authorize(Role.ADMIN), updateCourse);
router.delete('/:id', protect, authorize(Role.ADMIN), deleteCourse);

export default router;
