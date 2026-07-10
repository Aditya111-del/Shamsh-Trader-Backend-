import { Request, Response, NextFunction } from 'express';
import { Newsletter } from '../models/Newsletter';

// @desc    Get all newsletter subscribers
// @route   GET /api/v1/newsletter
// @access  Private/Admin
export const getSubscribers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    next(error);
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/v1/newsletter
// @access  Public
export const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.status === 'Unsubscribed') {
        existingSubscriber.status = 'Active';
        await existingSubscriber.save();
        res.status(200).json({ message: 'Successfully resubscribed!' });
        return;
      }
      res.status(400).json({ message: 'Email is already subscribed' });
      return;
    }

    const subscriber = await Newsletter.create({ email });
    res.status(201).json(subscriber);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a subscriber
// @route   DELETE /api/v1/newsletter/:id
// @access  Private/Admin
export const deleteSubscriber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);

    if (!subscriber) {
      res.status(404).json({ message: 'Subscriber not found' });
      return;
    }

    await subscriber.deleteOne();
    res.json({ message: 'Subscriber removed' });
  } catch (error) {
    next(error);
  }
};
