"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const Settings_1 = __importDefault(require("../models/Settings"));
// @desc    Get site settings
// @route   GET /api/v1/settings
// @access  Public
const getSettings = async (req, res, next) => {
    try {
        let settings = await Settings_1.default.findOne();
        if (!settings) {
            settings = await Settings_1.default.create({});
        }
        res.json(settings);
    }
    catch (error) {
        next(error);
    }
};
exports.getSettings = getSettings;
// @desc    Update site settings
// @route   PUT /api/v1/settings
// @access  Private/Admin
const updateSettings = async (req, res, next) => {
    try {
        let settings = await Settings_1.default.findOne();
        if (!settings) {
            settings = await Settings_1.default.create(req.body);
        }
        else {
            settings = await Settings_1.default.findByIdAndUpdate(settings._id, req.body, { new: true });
        }
        res.json(settings);
    }
    catch (error) {
        next(error);
    }
};
exports.updateSettings = updateSettings;
