import mongoose, { Document, Schema } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  status: 'Active' | 'Unsubscribed';
  subscribedAt: Date;
}

const newsletterSchema = new Schema<INewsletter>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    status: {
      type: String,
      enum: ['Active', 'Unsubscribed'],
      default: 'Active'
    },
    subscribedAt: { type: Date, default: Date.now },
  }
);

export const Newsletter = mongoose.model<INewsletter>('Newsletter', newsletterSchema);
