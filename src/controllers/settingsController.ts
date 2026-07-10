import { Request, Response, NextFunction } from 'express';
import Settings from '../models/Settings';

// @desc    Get site settings
// @route   GET /api/v1/settings
// @access  Public
export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update site settings
// @route   PUT /api/v1/settings
// @access  Private/Admin
export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};
