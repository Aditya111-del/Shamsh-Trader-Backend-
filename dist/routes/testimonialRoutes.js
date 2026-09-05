"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testimonialController_1 = require("../controllers/testimonialController");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const router = express_1.default.Router();
router.route('/')
    .get(testimonialController_1.getTestimonials)
    .post(auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), testimonialController_1.createTestimonial);
router.route('/:id')
    .put(auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), testimonialController_1.updateTestimonial)
    .delete(auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), testimonialController_1.deleteTestimonial);
exports.default = router;
