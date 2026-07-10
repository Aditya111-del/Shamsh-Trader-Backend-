import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';
import { getSponsors, createSponsor, deleteSponsor } from '../controllers/sponsorController';

const router = Router();

router.get('/', getSponsors);

router.post('/', protect, authorize(Role.ADMIN), createSponsor);
router.delete('/:id', protect, authorize(Role.ADMIN), deleteSponsor);

export default router;
