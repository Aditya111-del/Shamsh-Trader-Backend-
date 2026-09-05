"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const eventController_1 = require("../controllers/eventController");
const router = (0, express_1.Router)();
// Public routes
router.get('/', eventController_1.getEvents);
router.get('/:id', eventController_1.getEventById);
// Admin-only routes
router.post('/', auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), eventController_1.createEvent);
router.put('/:id', auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), eventController_1.updateEvent);
router.delete('/:id', auth_1.protect, (0, auth_1.authorize)(User_1.Role.ADMIN), eventController_1.deleteEvent);
exports.default = router;
