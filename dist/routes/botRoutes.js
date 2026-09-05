"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const botController_1 = require("../controllers/botController");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const router = express_1.default.Router();
router.route('/')
    .get(botController_1.getBots)
    .post(auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), botController_1.createBot);
router.route('/:id')
    .put(auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), botController_1.updateBot)
    .delete(auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), botController_1.deleteBot);
exports.default = router;
