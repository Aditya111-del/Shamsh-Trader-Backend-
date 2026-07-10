import mongoose, { Document, Schema } from 'mongoose';

export interface ISponsor extends Document {
  name: string;
  websiteUrl: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Partner';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sponsorSchema = new Schema<ISponsor>(
  {
    name: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    tier: { 
      type: String, 
      required: true,
      enum: ['Platinum', 'Gold', 'Silver', 'Partner'],
      default: 'Partner'
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Sponsor = mongoose.model<ISponsor>('Sponsor', sponsorSchema);
