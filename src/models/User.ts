import mongoose, { Document, Schema } from 'mongoose';

export enum Role {
  USER = 'USER',
  PREMIUM = 'PREMIUM',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  isVerified: boolean;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema);
