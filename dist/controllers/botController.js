"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBot = exports.updateBot = exports.createBot = exports.getBots = void 0;
const Bot_1 = require("../models/Bot");
// @desc    Get all bots
// @route   GET /api/v1/bots
// @access  Public
const getBots = async (req, res, next) => {
    try {
        const bots = await Bot_1.Bot.find({}).sort({ createdAt: -1 });
        res.json(bots);
    }
    catch (error) {
        next(error);
    }
};
exports.getBots = getBots;
// @desc    Create a bot
// @route   POST /api/v1/bots
// @access  Private/Admin
const createBot = async (req, res, next) => {
    try {
        const bot = new Bot_1.Bot(req.body);
        // If the new bot is a flagship, we might want to unset other flagships
        if (bot.isFlagship) {
            await Bot_1.Bot.updateMany({ isFlagship: true }, { isFlagship: false });
        }
        const createdBot = await bot.save();
        res.status(201).json(createdBot);
    }
    catch (error) {
        next(error);
    }
};
exports.createBot = createBot;
// @desc    Update a bot
// @route   PUT /api/v1/bots/:id
// @access  Private/Admin
const updateBot = async (req, res, next) => {
    try {
        const bot = await Bot_1.Bot.findById(req.params.id);
        if (bot) {
            if (req.body.isFlagship && !bot.isFlagship) {
                await Bot_1.Bot.updateMany({ isFlagship: true }, { isFlagship: false });
            }
            Object.assign(bot, req.body);
            const updatedBot = await bot.save();
            res.json(updatedBot);
        }
        else {
            res.status(404);
            throw new Error('Bot not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateBot = updateBot;
// @desc    Delete a bot
// @route   DELETE /api/v1/bots/:id
// @access  Private/Admin
const deleteBot = async (req, res, next) => {
    try {
        const bot = await Bot_1.Bot.findById(req.params.id);
        if (bot) {
            await bot.deleteOne();
            res.json({ message: 'Bot removed' });
        }
        else {
            res.status(404);
            throw new Error('Bot not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBot = deleteBot;
