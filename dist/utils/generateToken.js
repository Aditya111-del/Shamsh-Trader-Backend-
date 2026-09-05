"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearTokens = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Session_1 = require("../models/Session");
const generateTokens = async (res, userId) => {
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
    const accessToken = jsonwebtoken_1.default.sign({ userId }, jwtSecret, { expiresIn: '1h' });
    const refreshToken = jsonwebtoken_1.default.sign({ userId }, refreshSecret, { expiresIn: '7d' });
    // Save refresh token to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await Session_1.Session.create({
        userId,
        refreshToken,
        expiresAt,
    });
    const isProd = process.env.NODE_ENV === 'production';
    // Set cookies
    res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
const clearTokens = async (res, refreshToken) => {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        expires: new Date(0),
    });
    res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        expires: new Date(0),
    });
    if (refreshToken) {
        await Session_1.Session.deleteOne({ refreshToken });
    }
};
exports.clearTokens = clearTokens;
