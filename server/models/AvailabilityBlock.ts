import mongoose, { Schema, Model } from 'mongoose';

export interface AvailabilityBlockType {
  id: string;
  equipmentId: string;
  date: string; // YYYY-MM-DD format for atomic day-slot indexing
  bookingId?: string;
  reason?: 'booking' | 'maintenance' | 'owner_block';
  createdAt?: string;
}

const AvailabilityBlockSchema = new Schema<AvailabilityBlockType>(
  {
    id: { type: String, required: true, unique: true },
    equipmentId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    bookingId: { type: String, index: true },
    reason: { type: String, enum: ['booking', 'maintenance', 'owner_block'], default: 'booking' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);

// Compound Unique Index on equipmentId + date guarantees ZERO overlapping booking race conditions
AvailabilityBlockSchema.index({ equipmentId: 1, date: 1 }, { unique: true, name: 'unique_equipment_date_slot' });

export const AvailabilityBlockModel: Model<AvailabilityBlockType> =
  (mongoose.models.AvailabilityBlock as Model<AvailabilityBlockType>) ||
  mongoose.model<AvailabilityBlockType>('AvailabilityBlock', AvailabilityBlockSchema);
