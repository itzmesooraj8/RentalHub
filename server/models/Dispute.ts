import mongoose, { Schema, Model } from 'mongoose';
import { Dispute as DisputeType } from '../../src/types';

const DisputeSchema = new Schema<DisputeType>(
  {
    id: { type: String, required: true, unique: true, index: true },
    bookingId: { type: String, required: true, index: true },
    equipmentTitle: { type: String, required: true },
    raisedByUserId: { type: String },
    raisedByName: { type: String },
    raisedByRole: { type: String },
    againstUserId: { type: String },
    againstName: { type: String },
    renterName: { type: String, required: true },
    ownerName: { type: String, required: true },
    reason: { type: String, required: true },
    amountClaimed: { type: Number, required: true },
    status: { type: String, enum: ['open', 'under_review', 'resolved', 'dismissed'], default: 'open', index: true },
    description: { type: String, required: true },
    beforePhotos: [{ type: String }],
    afterPhotos: [{ type: String }],
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);

export const DisputeModel: Model<DisputeType> =
  (mongoose.models.Dispute as Model<DisputeType>) || mongoose.model<DisputeType>('Dispute', DisputeSchema);
