import { Request, Response, NextFunction } from 'express';
import { Sponsor } from '../models/Sponsor';

// @desc    Get all sponsors
// @route   GET /api/v1/sponsors
// @access  Public
export const getSponsors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sponsors = await Sponsor.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(sponsors);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new sponsor
// @route   POST /api/v1/sponsors
// @access  Private/Admin
export const createSponsor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, websiteUrl, tier } = req.body;

    if (!name || !websiteUrl) {
      res.status(400).json({ message: 'Name and website URL are required' });
      return;
    }

    const sponsor = await Sponsor.create({
      name,
      websiteUrl,
      tier: tier || 'Partner',
    });

    res.status(201).json(sponsor);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a sponsor
// @route   DELETE /api/v1/sponsors/:id
// @access  Private/Admin
export const deleteSponsor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
      res.status(404).json({ message: 'Sponsor not found' });
      return;
    }

    await sponsor.deleteOne();
    res.json({ message: 'Sponsor removed' });
  } catch (error) {
    next(error);
  }
};
