import mongoose, { Document, Schema } from 'mongoose';

export interface IBot extends Document {
  name: string;
  tag: string;
  tagColor: string;
  sparkline: string;
  monthly: string;
  winRate: string;
  maxDD: string;
  price: string;
  fileUrl: string;
  isFlagship: boolean;
  description?: string;
  totalEquity?: string;
}

const botSchema = new Schema<IBot>(
  {
    name: { type: String, required: true },
    tag: { type: String, required: true },
    tagColor: { type: String, required: true },
    sparkline: { type: String, default: '' },
    monthly: { type: String, required: true },
    winRate: { type: String, required: true },
    maxDD: { type: String, required: true },
    price: { type: String, required: true },
    fileUrl: { type: String, required: true },
    isFlagship: { type: Boolean, default: false },
    description: { type: String },
    totalEquity: { type: String },
  },
  { timestamps: true }
);

export const Bot = mongoose.model<IBot>('Bot', botSchema);
