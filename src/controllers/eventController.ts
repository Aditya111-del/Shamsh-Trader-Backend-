import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Event } from '../models/Event';

// ── Validation Schemas ────────────────────────────────────────────────────────

const createEventSchema = z.object({
  type: z.enum(['UPCOMING', 'ARCHIVE']).default('UPCOMING'),
  title: z.string().min(2, 'Title must be at least 2 characters').trim(),
  description: z.string().optional(),
  location: z.string().optional(),
  date: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  time: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  section: z.string().optional(),
  ticketLink: z.string().optional(),
  status: z.enum(['AVAILABLE', 'FULL']).optional().default('AVAILABLE'),
  isPublished: z.boolean().optional().default(true),
  tags: z.array(z.string()).optional().default([]),
});

const updateEventSchema = createEventSchema.partial();

// ── Helper: sanitize image array (remove empty strings) ──────────────────────
const sanitizeImages = (images: string[] = []) =>
  images.map((url) => url.trim()).filter((url) => url.length > 0);

// ── Controllers ───────────────────────────────────────────────────────────────

// @desc    Get all events (optionally filter by ?type=UPCOMING|ARCHIVE)
// @route   GET /api/v1/events
// @access  Public
export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.type === 'UPCOMING' || req.query.type === 'ARCHIVE') {
      filter.type = req.query.type;
    }
    const events = await Event.find(filter).sort({ date: 1, createdAt: -1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/v1/events/:id
// @access  Public
export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new event
// @route   POST /api/v1/events
// @access  Private/Admin
export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createEventSchema.parse(req.body);

    const event = await Event.create({
      ...parsed,
      images: sanitizeImages(parsed.images),
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/v1/events/:id
// @access  Private/Admin
export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateEventSchema.parse(req.body);

    // Sanitize images only if they were provided in the update payload
    if (parsed.images !== undefined) {
      parsed.images = sanitizeImages(parsed.images);
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: parsed },
      { new: true, runValidators: true }
    );

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/v1/events/:id
// @access  Private/Admin
export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};
