import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';
import { getSubscribers, subscribe, deleteSubscriber } from '../controllers/newsletterController';

const router = Router();

router.post('/', subscribe);

router.get('/', protect, authorize(Role.ADMIN), getSubscribers);
router.delete('/:id', protect, authorize(Role.ADMIN), deleteSubscriber);

export default router;
