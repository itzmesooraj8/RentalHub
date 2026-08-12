import mongoose, { Schema } from "mongoose";
const EquipmentSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    ownerId: { type: String, required: true, index: true },
    ownerName: { type: String, required: true },
    ownerAvatar: { type: String },
    ownerTrustScore: { type: Number, default: 98 },
    ownerKyVerified: { type: Boolean, default: true },
    title: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    industry: { type: String, required: true, index: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    locationCoordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    dailyRate: { type: Number, required: true, index: true },
    weeklyRate: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    embedding: { type: [Number], default: [] },
    rating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },
    images: [{ type: String }],
    specs: { type: Map, of: String },
    co2SavedPerDayKg: { type: Number, default: 15 },
    availabilityStatus: { type: String, enum: ["available", "rented", "maintenance"], default: "available", index: true },
    approvedByAdmin: { type: Boolean, default: true, index: true },
    createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
  },
  {
    timestamps: true
  }
);
EquipmentSchema.index({ locationCoordinates: "2dsphere" });
EquipmentSchema.index({ category: 1, dailyRate: 1 });
EquipmentSchema.index({ industry: 1, category: 1 });
export const EquipmentModel = mongoose.models.Equipment || mongoose.model("Equipment", EquipmentSchema);
