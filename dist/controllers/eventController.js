"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getEvents = void 0;
const zod_1 = require("zod");
const Event_1 = require("../models/Event");
// ── Validation Schemas ────────────────────────────────────────────────────────
const createEventSchema = zod_1.z.object({
    type: zod_1.z.enum(['UPCOMING', 'ARCHIVE']).default('UPCOMING'),
    title: zod_1.z.string().min(2, 'Title must be at least 2 characters').trim(),
    description: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    date: zod_1.z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
    time: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional().default([]),
    section: zod_1.z.string().optional(),
    ticketLink: zod_1.z.string().optional(),
    status: zod_1.z.enum(['AVAILABLE', 'FULL']).optional().default('AVAILABLE'),
    isPublished: zod_1.z.boolean().optional().default(true),
    tags: zod_1.z.array(zod_1.z.string()).optional().default([]),
});
const updateEventSchema = createEventSchema.partial();
// ── Helper: sanitize image array (remove empty strings) ──────────────────────
const sanitizeImages = (images = []) => images.map((url) => url.trim()).filter((url) => url.length > 0);
// ── Controllers ───────────────────────────────────────────────────────────────
// @desc    Get all events (optionally filter by ?type=UPCOMING|ARCHIVE)
// @route   GET /api/v1/events
// @access  Public
const getEvents = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.type === 'UPCOMING' || req.query.type === 'ARCHIVE') {
            filter.type = req.query.type;
        }
        const events = await Event_1.Event.find(filter).sort({ date: 1, createdAt: -1 });
        res.json(events);
    }
    catch (error) {
        next(error);
    }
};
exports.getEvents = getEvents;
// @desc    Get single event by ID
// @route   GET /api/v1/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
    try {
        const event = await Event_1.Event.findById(req.params.id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.json(event);
    }
    catch (error) {
        next(error);
    }
};
exports.getEventById = getEventById;
// @desc    Create a new event
// @route   POST /api/v1/events
// @access  Private/Admin
const createEvent = async (req, res, next) => {
    try {
        const parsed = createEventSchema.parse(req.body);
        const event = await Event_1.Event.create({
            ...parsed,
            images: sanitizeImages(parsed.images),
        });
        res.status(201).json(event);
    }
    catch (error) {
        next(error);
    }
};
exports.createEvent = createEvent;
// @desc    Update an event
// @route   PUT /api/v1/events/:id
// @access  Private/Admin
const updateEvent = async (req, res, next) => {
    try {
        const parsed = updateEventSchema.parse(req.body);
        // Sanitize images only if they were provided in the update payload
        if (parsed.images !== undefined) {
            parsed.images = sanitizeImages(parsed.images);
        }
        const event = await Event_1.Event.findByIdAndUpdate(req.params.id, { $set: parsed }, { new: true, runValidators: true });
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.json(event);
    }
    catch (error) {
        next(error);
    }
};
exports.updateEvent = updateEvent;
// @desc    Delete an event
// @route   DELETE /api/v1/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event_1.Event.findById(req.params.id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        await event.deleteOne();
        res.json({ message: 'Event deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteEvent = deleteEvent;
