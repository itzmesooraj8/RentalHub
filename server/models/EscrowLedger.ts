import mongoose, { Schema, Model } from 'mongoose';
import { EscrowLedger as EscrowLedgerType } from '../../src/types';

const EscrowLedgerSchema = new Schema<EscrowLedgerType>(
  {
    id: { type: String, required: true, unique: true, index: true },
    bookingId: { type: String, required: true, unique: true, index: true },
    equipmentId: { type: String, required: true, index: true },
    equipmentTitle: { type: String },
    customerId: { type: String, required: true, index: true },
    customerName: { type: String },
    ownerId: { type: String, required: true, index: true },
    ownerName: { type: String },
    amount: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    status: {
      type: String,
      enum: ['HELD', 'RELEASED', 'DISPUTED', 'REFUNDED'],
      default: 'HELD',
      index: true,
    },
    heldAt: { type: String, default: () => new Date().toISOString() },
    releasedAt: { type: String },
    disputedAt: { type: String },
    ledgerHistory: [
      {
        action: { type: String, required: true },
        timestamp: { type: String, required: true },
        actor: { type: String, required: true },
        status: { type: String, required: true },
        notes: { type: String },
      },
    ],
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);

export const EscrowLedgerModel: Model<EscrowLedgerType> =
  (mongoose.models.EscrowLedger as Model<EscrowLedgerType>) ||
  mongoose.model<EscrowLedgerType>('EscrowLedger', EscrowLedgerSchema);
