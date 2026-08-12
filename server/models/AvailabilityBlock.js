import mongoose, { Schema } from "mongoose";
const AvailabilityBlockSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    equipmentId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    bookingId: { type: String, index: true },
    reason: { type: String, enum: ["booking", "maintenance", "owner_block"], default: "booking" },
    createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
  },
  {
    timestamps: true
  }
);
AvailabilityBlockSchema.index({ equipmentId: 1, date: 1 }, { unique: true, name: "unique_equipment_date_slot" });
export const AvailabilityBlockModel = mongoose.models.AvailabilityBlock || mongoose.model("AvailabilityBlock", AvailabilityBlockSchema);
