"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingsController_1 = require("../controllers/settingsController");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const router = express_1.default.Router();
router.route('/')
    .get(settingsController_1.getSettings)
    .put(auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), settingsController_1.updateSettings);
exports.default = router;
