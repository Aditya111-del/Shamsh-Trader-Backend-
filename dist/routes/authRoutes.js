"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post('/register', authController_1.registerUser);
router.post('/login', authController_1.loginUser);
router.post('/google', authController_1.googleAuth);
router.post('/logout', authController_1.logoutUser);
router.post('/refresh', authController_1.refresh);
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/reset-password', authController_1.resetPassword);
router.post('/verify-email', authController_1.verifyEmail);
router.get('/profile', auth_1.protect, authController_1.getProfile);
exports.default = router;
