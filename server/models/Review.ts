import mongoose, { Schema, Model } from 'mongoose';
import { Review as ReviewType } from '../../src/types';

const ReviewSchema = new Schema<ReviewType>(
  {
    id: { type: String, required: true, unique: true, index: true },
    equipmentId: { type: String, required: true, index: true },
    fromUserId: { type: String, required: true },
    fromUserName: { type: String, required: true },
    fromUserAvatar: { type: String },
    fromRole: { type: String, enum: ['customer', 'owner'], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);

export const ReviewModel: Model<ReviewType> =
  (mongoose.models.Review as Model<ReviewType>) || mongoose.model<ReviewType>('Review', ReviewSchema);
