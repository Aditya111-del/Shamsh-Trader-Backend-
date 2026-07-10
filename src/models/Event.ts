import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  type: 'UPCOMING' | 'ARCHIVE';
  title: string;
  description?: string;
  location?: string;
  date?: Date;
  time?: string;
  images: string[];
  section?: string;        // e.g. "Patna event 2025" — for archive cards
  ticketLink?: string;
  status: 'AVAILABLE' | 'FULL';
  isPublished: boolean;    // draft vs live
  tags: string[];          // e.g. ['trading', 'online', 'workshop']
  registrations: string[]; // array of user IDs who registered
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    type: {
      type: String,
      enum: ['UPCOMING', 'ARCHIVE'],
      required: true,
      default: 'UPCOMING',
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    location: { type: String, trim: true },
    date: { type: Date },
    time: { type: String },
    images: [{ type: String }],
    section: { type: String, trim: true },
    ticketLink: { type: String, trim: true },
    status: { type: String, enum: ['AVAILABLE', 'FULL'], default: 'AVAILABLE' },
    isPublished: { type: Boolean, default: true },
    tags: [{ type: String, trim: true }],
    registrations: [{ type: String }], // store user _id strings
  },
  { timestamps: true }
);

// Compound indexes for efficient filtering on the Events page
eventSchema.index({ type: 1, date: -1 });
eventSchema.index({ isPublished: 1, type: 1 });

export const Event = mongoose.model<IEvent>('Event', eventSchema);
