import { Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Session } from '../models/Session';

export const generateTokens = async (res: Response, userId: string | mongoose.Types.ObjectId) => {
  const jwtSecret = process.env.JWT_SECRET || 'secret';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

  const accessToken = jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: '7d' });

  // Save refresh token to database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await Session.create({
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

export const clearTokens = async (res: Response, refreshToken?: string) => {
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
    await Session.deleteOne({ refreshToken });
  }
};
