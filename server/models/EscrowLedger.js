import mongoose, { Schema } from "mongoose";
const EscrowLedgerSchema = new Schema(
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
      enum: ["HELD", "RELEASED", "DISPUTED", "REFUNDED"],
      default: "HELD",
      index: true
    },
    heldAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() },
    releasedAt: { type: String },
    disputedAt: { type: String },
    ledgerHistory: [
      {
        action: { type: String, required: true },
        timestamp: { type: String, required: true },
        actor: { type: String, required: true },
        status: { type: String, required: true },
        notes: { type: String }
      }
    ],
    createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
  },
  {
    timestamps: true
  }
);
export const EscrowLedgerModel = mongoose.models.EscrowLedger || mongoose.model("EscrowLedger", EscrowLedgerSchema);
