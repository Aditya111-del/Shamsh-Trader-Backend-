import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { generateTokens, clearTokens } from '../utils/generateToken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { Session } from '../models/Session';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    if (user) {
      const { accessToken } = await generateTokens(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: accessToken, // Included as Bearer fallback for cross-origin dev
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { accessToken } = await generateTokens(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: accessToken, // Included as Bearer fallback for cross-origin dev
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await clearTokens(res, refreshToken);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401);
      throw new Error('No refresh token provided');
    }

    const session = await Session.findOne({ refreshToken });
    if (!session || session.expiresAt < new Date()) {
      res.status(401);
      throw new Error('Refresh token invalid or expired');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh-secret') as any;
    
    // Clear old token and generate new pair (Token Rotation)
    await Session.deleteOne({ refreshToken });
    await generateTokens(res, decoded.userId);

    res.status(200).json({ message: 'Token refreshed successfully' });
  } catch (error) {
    res.status(401);
    next(new Error('Invalid refresh token'));
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id).select('-passwordHash');
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement SMTP integration
  res.status(200).json({ message: 'Password reset link sent (Stub)' });
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement SMTP integration
  res.status(200).json({ message: 'Password reset successfully (Stub)' });
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement SMTP integration
  res.status(200).json({ message: 'Email verified successfully (Stub)' });
};
