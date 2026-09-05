"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const featuredPostController_1 = require("../controllers/featuredPostController");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const router = express_1.default.Router();
router.route('/')
    .get(featuredPostController_1.getFeaturedPosts);
router.route('/:type')
    .get(featuredPostController_1.getFeaturedPostByType)
    .put(auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), featuredPostController_1.updateFeaturedPost);
exports.default = router;
