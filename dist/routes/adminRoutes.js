"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const adminController_1 = require("../controllers/adminController");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
// Protect all admin routes and strictly require ADMIN role
router.use(auth_1.protect);
router.use((0, auth_1.authorize)(User_1.Role.ADMIN));
router.get('/stats', adminController_1.getDashboardStats);
router.get('/users', adminController_1.getUsers);
router.patch('/users/:id/role', adminController_1.updateUserRole);
router.delete('/users/:id', adminController_1.deleteUser);
exports.default = router;
