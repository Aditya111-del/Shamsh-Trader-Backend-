import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityPost extends Document {
  platform: 'YouTube' | 'X' | 'Instagram';
  type: 'media' | 'quote';
  link: string;
  image?: string;
  title?: string;
  quote?: string;
  meta?: string;
  stats?: string[];
  playButton?: boolean;
  duration?: string;
  time?: string;
  delay?: number;
}

const CommunityPostSchema: Schema = new Schema(
  {
    platform: { type: String, required: true, enum: ['YouTube', 'X', 'Instagram'] },
    type: { type: String, required: true, enum: ['media', 'quote'] },
    link: { type: String, required: true },
    image: { type: String },
    title: { type: String },
    quote: { type: String },
    meta: { type: String },
    stats: { type: [String], default: [] },
    playButton: { type: Boolean, default: false },
    duration: { type: String },
    time: { type: String },
    delay: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICommunityPost>('CommunityPost', CommunityPostSchema);
