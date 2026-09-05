"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updateProfile = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const updateProfile = async (req, res, next) => {
    try {
        const user = await User_1.User.findById(req.user?._id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        user.name = req.body.name || user.name;
        // We do not allow email updates in this simple version to prevent needing re-verification
        const updatedUser = await user.save();
        res.json({
            message: 'Profile updated',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isVerified: updatedUser.isVerified,
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: 'Please provide current and new password' });
            return;
        }
        const user = await User_1.User.findById(req.user?._id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (!user.passwordHash) {
            res.status(400).json({ message: 'Accounts authenticated via Google do not have a password' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid current password' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        user.passwordHash = await bcryptjs_1.default.hash(newPassword, salt);
        await user.save();
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePassword = updatePassword;
