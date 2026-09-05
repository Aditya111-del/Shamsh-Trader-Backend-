"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.resetPassword = exports.forgotPassword = exports.getProfile = exports.refresh = exports.logoutUser = exports.loginUser = exports.registerUser = exports.googleAuth = void 0;
const User_1 = require("../models/User");
const generateToken_1 = require("../utils/generateToken");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Session_1 = require("../models/Session");
const googleAuth = async (req, res, next) => {
    try {
        const { credential, access_token, demoUser } = req.body;
        let email = '';
        let name = '';
        let picture = '';
        let sub = '';
        if (credential) {
            // Verify Google ID token via tokeninfo endpoint
            const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
            if (!response.ok) {
                res.status(401);
                throw new Error('Invalid Google credential token');
            }
            const data = await response.json();
            if (data.email_verified !== 'true' && data.email_verified !== true) {
                res.status(400);
                throw new Error('Google email is not verified');
            }
            email = data.email;
            name = data.name || data.given_name || data.email.split('@')[0];
            picture = data.picture || '';
            sub = data.sub;
        }
        else if (access_token) {
            // Verify Google access token via userinfo endpoint
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${access_token}` },
            });
            if (!response.ok) {
                res.status(401);
                throw new Error('Invalid Google access token');
            }
            const data = await response.json();
            if (data.email_verified !== 'true' && data.email_verified !== true) {
                res.status(400);
                throw new Error('Google email is not verified');
            }
            email = data.email;
            name = data.name || data.given_name || data.email.split('@')[0];
            picture = data.picture || '';
            sub = data.sub;
        }
        else if (demoUser && process.env.NODE_ENV !== 'production') {
            // Development / Demo login fallback when Google credentials are not yet set up
            email = demoUser.email || 'demo.google@shamshtrader.com';
            name = demoUser.name || 'Google Trader Demo';
            picture = demoUser.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
            sub = `demo_google_${Date.now()}`;
        }
        else {
            res.status(400);
            throw new Error('Missing Google authentication token');
        }
        if (!email) {
            res.status(400);
            throw new Error('Failed to retrieve email from Google');
        }
        let user = await User_1.User.findOne({
            $or: [
                ...(sub ? [{ googleId: sub }] : []),
                { email: email.toLowerCase() },
            ],
        });
        if (user) {
            // Existing user — link Google ID or avatar if not yet linked
            let updated = false;
            if (sub && !user.googleId) {
                user.googleId = sub;
                updated = true;
            }
            if (picture && !user.profileImage) {
                user.profileImage = picture;
                updated = true;
            }
            if (!user.isVerified) {
                user.isVerified = true;
                updated = true;
            }
            if (updated) {
                await user.save();
            }
        }
        else {
            // New user signup via Google
            user = await User_1.User.create({
                name,
                email: email.toLowerCase(),
                googleId: sub,
                profileImage: picture,
                isVerified: true,
                authProvider: 'google',
                role: User_1.Role.USER,
            });
        }
        const { accessToken } = await (0, generateToken_1.generateTokens)(res, user._id);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            token: accessToken,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.googleAuth = googleAuth;
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body);
        const userExists = await User_1.User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const user = await User_1.User.create({
            name,
            email,
            passwordHash,
        });
        if (user) {
            const { accessToken } = await (0, generateToken_1.generateTokens)(res, user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: accessToken, // Included as Bearer fallback for cross-origin dev
            });
        }
        else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const user = await User_1.User.findOne({ email });
        if (user && user.passwordHash && (await bcryptjs_1.default.compare(password, user.passwordHash))) {
            const { accessToken } = await (0, generateToken_1.generateTokens)(res, user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: accessToken, // Included as Bearer fallback for cross-origin dev
            });
        }
        else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        await (0, generateToken_1.clearTokens)(res, refreshToken);
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.logoutUser = logoutUser;
const refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401);
            throw new Error('No refresh token provided');
        }
        const session = await Session_1.Session.findOne({ refreshToken });
        if (!session || session.expiresAt < new Date()) {
            res.status(401);
            throw new Error('Refresh token invalid or expired');
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh-secret');
        // Clear old token and generate new pair (Token Rotation)
        await Session_1.Session.deleteOne({ refreshToken });
        await (0, generateToken_1.generateTokens)(res, decoded.userId);
        res.status(200).json({ message: 'Token refreshed successfully' });
    }
    catch (error) {
        res.status(401);
        next(new Error('Invalid refresh token'));
    }
};
exports.refresh = refresh;
const getProfile = async (req, res, next) => {
    try {
        const user = await User_1.User.findById(req.user?._id).select('-passwordHash');
        if (user) {
            res.json(user);
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
const forgotPassword = async (req, res, next) => {
    // TODO: Implement SMTP integration
    res.status(200).json({ message: 'Password reset link sent (Stub)' });
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    // TODO: Implement SMTP integration
    res.status(200).json({ message: 'Password reset successfully (Stub)' });
};
exports.resetPassword = resetPassword;
const verifyEmail = async (req, res, next) => {
    // TODO: Implement SMTP integration
    res.status(200).json({ message: 'Email verified successfully (Stub)' });
};
exports.verifyEmail = verifyEmail;
