import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { upload } from '../utils/cloudinary';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = express.Router();

import fs from 'fs';
import path from 'path';

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure local storage for raw files (like bots)
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const uploadLocal = multer({ storage: localStorage });

// @desc    Upload single image
// @route   POST /api/v1/upload
// @access  Private/Admin
router.post('/', protect, authorize(Role.ADMIN), upload.single('image'), (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    // Cloudinary returns the secure URL via req.file.path
    res.json({
      message: 'Image uploaded successfully',
      url: req.file.path,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Upload single raw file locally
// @route   POST /api/v1/upload/file
// @access  Private/Admin
router.post('/file', protect, authorize(Role.ADMIN), uploadLocal.single('file'), (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    // Return the relative path to be served statically
    res.json({
      message: 'File uploaded successfully',
      url: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
