import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  quote: string;
  initial?: string;
  name: string;
  meta?: string;
  link?: string;
  platform?: 'X' | 'Instagram' | 'None';
  delay?: number;
}

const TestimonialSchema: Schema = new Schema(
  {
    quote: { type: String, required: true },
    initial: { type: String },
    name: { type: String, required: true },
    meta: { type: String },
    link: { type: String },
    platform: { type: String, enum: ['X', 'Instagram', 'None'], default: 'None' },
    delay: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
