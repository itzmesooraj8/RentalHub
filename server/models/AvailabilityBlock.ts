import mongoose, { Schema, Model } from 'mongoose';
import { AvailabilityBlock as AvailabilityBlockType } from '../../src/types';

const AvailabilityBlockSchema = new Schema<AvailabilityBlockType>(
  {
    id: { type: String, required: true, unique: true, index: true },
    equipmentId: { type: String, required: true, index: true },
    startDate: { type: String, required: true, index: true },
    endDate: { type: String, required: true, index: true },
    reason: { type: String, enum: ['booking', 'booked', 'maintenance', 'owner_block', 'owner_blocked'], required: true },
    bookingId: { type: String },
  },
  {
    timestamps: true,
  }
);

AvailabilityBlockSchema.index({ equipmentId: 1, startDate: 1, endDate: 1 }, { unique: true, name: 'unique_equipment_booking_dates' });

export const AvailabilityBlockModel: Model<AvailabilityBlockType> =
  (mongoose.models.AvailabilityBlock as Model<AvailabilityBlockType>) ||
  mongoose.model<AvailabilityBlockType>('AvailabilityBlock', AvailabilityBlockSchema);
