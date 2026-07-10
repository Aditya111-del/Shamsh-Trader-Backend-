import { Router } from 'express';
import { protect } from '../middlewares/auth';
import { updateProfile, updatePassword } from '../controllers/userController';

const router = Router();

// Protect all user routes (must be logged in)
router.use(protect);

router.put('/profile', updateProfile);
router.put('/password', updatePassword);

export default router;
