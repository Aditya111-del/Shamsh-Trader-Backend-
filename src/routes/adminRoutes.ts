import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth';
import { getDashboardStats, getUsers, updateUserRole, deleteUser } from '../controllers/adminController';
import { Role } from '../models/User';

const router = Router();

// Protect all admin routes and strictly require ADMIN role
router.use(protect);
router.use(authorize(Role.ADMIN));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
