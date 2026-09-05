"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../utils/cloudinary");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const router = express_1.default.Router();
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Create uploads directory if it doesn't exist
const uploadDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Configure local storage for raw files (like bots)
const localStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const uploadLocal = (0, multer_1.default)({ storage: localStorage });
// @desc    Upload single image
// @route   POST /api/v1/upload
// @access  Private/Admin
router.post('/', auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), cloudinary_1.upload.single('image'), (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
});
// @desc    Upload single raw file locally
// @route   POST /api/v1/upload/file
// @access  Private/Admin
router.post('/file', auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), uploadLocal.single('file'), (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
