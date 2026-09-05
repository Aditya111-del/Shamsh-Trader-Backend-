"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const protect = async (req, res, next) => {
    let token;
    // 1. Try cookie first (primary method — set at login via httpOnly cookie)
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    // 2. Fallback to Authorization Bearer header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        res.status(401);
        return next(new Error('Not authorized, no token'));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.User.findById(decoded.userId).select('-passwordHash');
        if (!user) {
            res.status(401);
            return next(new Error('Not authorized, user not found'));
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401);
        next(new Error('Not authorized, token failed'));
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            return next(new Error(`User role ${req.user?.role} is not authorized to access this route`));
        }
        next();
    };
};
exports.authorize = authorize;
