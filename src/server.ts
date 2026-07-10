import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({
  // Relax CSP in development so the API is reachable from the local Vite dev server
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173,https://shamsh-trader-frontend.vercel.app')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman) or matching origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
}));

// Handle all CORS preflight requests globally
app.options(/(.*)/, cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

import { errorHandler, notFound } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import courseRoutes from './routes/courseRoutes';
import blogRoutes from './routes/blogRoutes';
import eventRoutes from './routes/eventRoutes';
import sponsorRoutes from './routes/sponsorRoutes';
import newsletterRoutes from './routes/newsletterRoutes';
import uploadRoutes from './routes/uploadRoutes';
import featuredRoutes from './routes/featuredRoutes';
import botRoutes from './routes/botRoutes';
import communityRoutes from './routes/communityRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import settingsRoutes from './routes/settingsRoutes';

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/sponsors', sponsorRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/featured-posts', featuredRoutes);
app.use('/api/v1/bots', botRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Database Connection & Server Start ────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shamsh_trader';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    app.listen(PORT as number, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });
