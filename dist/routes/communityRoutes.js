"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const communityController_1 = require("../controllers/communityController");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const router = express_1.default.Router();
router.route('/yt-meta')
    .get(auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), communityController_1.fetchYouTubeMeta);
router.route('/')
    .get(communityController_1.getPosts)
    .post(auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), communityController_1.createPost);
router.route('/:id')
    .put(auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), communityController_1.updatePost)
    .delete(auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), communityController_1.deletePost);
exports.default = router;
