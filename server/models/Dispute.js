import mongoose, { Schema } from "mongoose";
const DisputeSchema = new Schema(
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
    status: { type: String, enum: ["open", "under_review", "resolved", "dismissed"], default: "open", index: true },
    description: { type: String, required: true },
    beforePhotos: [{ type: String }],
    afterPhotos: [{ type: String }],
    createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
  },
  {
    timestamps: true
  }
);
export const DisputeModel = mongoose.models.Dispute || mongoose.model("Dispute", DisputeSchema);
