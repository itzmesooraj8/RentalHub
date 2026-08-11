import mongoose, { Schema, Model } from 'mongoose';
import { User as UserType } from '../../src/types';

export interface IUserMongo extends UserType {
  passwordHash?: string;
}

const UserSchema = new Schema<IUserMongo>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, select: false },
    avatar: { type: String },
    role: { type: String, enum: ['customer', 'owner', 'admin'], default: 'customer', index: true },
    phone: { type: String },
    location: { type: String },
    bio: { type: String },
    trustScore: { type: Number, default: 95 },
    kycStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
    kycVerified: { type: Boolean, default: false },
    kycDocUrl: { type: String },
    completedRentalsCount: { type: Number, default: 0 },
    onTimeReturnRate: { type: Number, default: 100 },
    memberSince: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
    favorites: [{ type: String }],
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);

export const UserModel: Model<IUserMongo> =
  (mongoose.models.User as Model<IUserMongo>) || mongoose.model<IUserMongo>('User', UserSchema);
