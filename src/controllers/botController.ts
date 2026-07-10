import { Request, Response, NextFunction } from 'express';
import { Bot } from '../models/Bot';

// @desc    Get all bots
// @route   GET /api/v1/bots
// @access  Public
export const getBots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bots = await Bot.find({}).sort({ createdAt: -1 });
    res.json(bots);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a bot
// @route   POST /api/v1/bots
// @access  Private/Admin
export const createBot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bot = new Bot(req.body);
    
    // If the new bot is a flagship, we might want to unset other flagships
    if (bot.isFlagship) {
      await Bot.updateMany({ isFlagship: true }, { isFlagship: false });
    }

    const createdBot = await bot.save();
    res.status(201).json(createdBot);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a bot
// @route   PUT /api/v1/bots/:id
// @access  Private/Admin
export const updateBot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bot = await Bot.findById(req.params.id);

    if (bot) {
      if (req.body.isFlagship && !bot.isFlagship) {
        await Bot.updateMany({ isFlagship: true }, { isFlagship: false });
      }

      Object.assign(bot, req.body);
      const updatedBot = await bot.save();
      res.json(updatedBot);
    } else {
      res.status(404);
      throw new Error('Bot not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a bot
// @route   DELETE /api/v1/bots/:id
// @access  Private/Admin
export const deleteBot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bot = await Bot.findById(req.params.id);

    if (bot) {
      await bot.deleteOne();
      res.json({ message: 'Bot removed' });
    } else {
      res.status(404);
      throw new Error('Bot not found');
    }
  } catch (error) {
    next(error);
  }
};
