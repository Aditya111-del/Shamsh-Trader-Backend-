import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  level: string;
  levelColor: string;
  image: string;
  meta: string;
  price: string;
  externalLink: string;
  isFlagship: boolean;
  includes: string[];
  delay: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, required: true },
    levelColor: { type: String, required: true },
    image: { type: String, required: true },
    meta: { type: String, required: true },
    price: { type: String, required: true },
    externalLink: { type: String, required: true },
    isFlagship: { type: Boolean, default: false },
    includes: { type: [String], default: [] },
    delay: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>('Course', courseSchema);
