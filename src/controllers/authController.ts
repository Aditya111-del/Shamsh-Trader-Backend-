import { Request, Response, NextFunction } from 'express';
import { User, Role } from '../models/User';
import { generateTokens, clearTokens } from '../utils/generateToken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { Session } from '../models/Session';

export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
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
      const data = await response.json() as any;
      if (data.email_verified !== 'true' && data.email_verified !== true) {
        res.status(400);
        throw new Error('Google email is not verified');
      }
      email = data.email;
      name = data.name || data.given_name || data.email.split('@')[0];
      picture = data.picture || '';
      sub = data.sub;
    } else if (access_token) {
      // Verify Google access token via userinfo endpoint
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (!response.ok) {
        res.status(401);
        throw new Error('Invalid Google access token');
      }
      const data = await response.json() as any;
      if (data.email_verified !== 'true' && data.email_verified !== true) {
        res.status(400);
        throw new Error('Google email is not verified');
      }
      email = data.email;
      name = data.name || data.given_name || data.email.split('@')[0];
      picture = data.picture || '';
      sub = data.sub;
    } else if (demoUser && process.env.NODE_ENV !== 'production') {
      // Development / Demo login fallback when Google credentials are not yet set up
      email = demoUser.email || 'demo.google@shamshtrader.com';
      name = demoUser.name || 'Google Trader Demo';
      picture = demoUser.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
      sub = `demo_google_${Date.now()}`;
    } else {
      res.status(400);
      throw new Error('Missing Google authentication token');
    }

    if (!email) {
      res.status(400);
      throw new Error('Failed to retrieve email from Google');
    }

    let user = await User.findOne({
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
    } else {
      // New user signup via Google
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId: sub,
        profileImage: picture,
        isVerified: true,
        authProvider: 'google',
        role: Role.USER,
      });
    }

    const { accessToken } = await generateTokens(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

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

    if (user && user.passwordHash && (await bcrypt.compare(password, user.passwordHash))) {
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
