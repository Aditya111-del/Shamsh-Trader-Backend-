"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// Protect all user routes (must be logged in)
router.use(auth_1.protect);
router.put('/profile', userController_1.updateProfile);
router.put('/password', userController_1.updatePassword);
exports.default = router;
