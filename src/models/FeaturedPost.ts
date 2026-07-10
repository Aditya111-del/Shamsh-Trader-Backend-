import mongoose, { Document, Schema } from 'mongoose';

export interface IFeaturedPost {
  type: 'WEEKLY' | 'FEATURED';
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  category?: string;
  dateText: string;
  readTime: string;
  externalLink: string;
}

const featuredPostSchema = new Schema<IFeaturedPost>(
  {
    type: { type: String, enum: ['WEEKLY', 'FEATURED'], required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: '' },
    image: { type: String, required: true },
    category: { type: String, default: '' },
    dateText: { type: String, required: true },
    readTime: { type: String, required: true },
    externalLink: { type: String, default: '' },
  },
  { timestamps: true }
);

export const FeaturedPost = mongoose.model<IFeaturedPost>('FeaturedPost', featuredPostSchema);
