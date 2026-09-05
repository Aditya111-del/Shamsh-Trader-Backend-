"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscriber = exports.subscribe = exports.getSubscribers = void 0;
const Newsletter_1 = require("../models/Newsletter");
// @desc    Get all newsletter subscribers
// @route   GET /api/v1/newsletter
// @access  Private/Admin
const getSubscribers = async (req, res, next) => {
    try {
        const subscribers = await Newsletter_1.Newsletter.find().sort({ subscribedAt: -1 });
        res.json(subscribers);
    }
    catch (error) {
        next(error);
    }
};
exports.getSubscribers = getSubscribers;
// @desc    Subscribe to newsletter
// @route   POST /api/v1/newsletter
// @access  Public
const subscribe = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        const existingSubscriber = await Newsletter_1.Newsletter.findOne({ email });
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
        const subscriber = await Newsletter_1.Newsletter.create({ email });
        res.status(201).json(subscriber);
    }
    catch (error) {
        next(error);
    }
};
exports.subscribe = subscribe;
// @desc    Delete a subscriber
// @route   DELETE /api/v1/newsletter/:id
// @access  Private/Admin
const deleteSubscriber = async (req, res, next) => {
    try {
        const subscriber = await Newsletter_1.Newsletter.findById(req.params.id);
        if (!subscriber) {
            res.status(404).json({ message: 'Subscriber not found' });
            return;
        }
        await subscriber.deleteOne();
        res.json({ message: 'Subscriber removed' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSubscriber = deleteSubscriber;
