import express from 'express';
import { registerUser, loginUser, logoutUser, refresh, getProfile, forgotPassword, resetPassword, verifyEmail } from '../controllers/authController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.get('/profile', protect, getProfile);

export default router;
