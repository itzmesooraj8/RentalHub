import mongoose, { Schema } from "mongoose";
const BookingSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    equipmentId: { type: String, required: true, index: true },
    equipmentTitle: { type: String, required: true },
    equipmentImage: { type: String },
    equipmentCategory: { type: String },
    customerId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    renterId: { type: String },
    renterName: { type: String },
    ownerId: { type: String, required: true, index: true },
    ownerName: { type: String, required: true },
    startDate: { type: String, required: true, index: true },
    endDate: { type: String, required: true, index: true },
    deliveryMethod: { type: String, enum: ["pickup", "delivery"], default: "delivery" },
    deliveryAddress: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "pickup_ready", "active", "locked", "returning", "completed", "cancelled", "disputed"],
      default: "confirmed",
      index: true
    },
    priceBreakdown: {
      dailyRate: { type: Number, required: true },
      rentalDays: { type: Number, required: true },
      subtotal: { type: Number, required: true },
      deliveryFee: { type: Number, default: 0 },
      securityDeposit: { type: Number, required: true },
      platformFee: { type: Number, required: true },
      insuranceFee: { type: Number, required: true },
      total: { type: Number, required: true }
    },
    paymentStatus: { type: String, enum: ["unpaid", "authorized", "paid", "refunded"], default: "paid" },
    pickupTimestamp: { type: String },
    returnTimestamp: { type: String },
    conditionReportBefore: {
      notes: { type: String },
      photos: [{ type: String }],
      verifiedBy: { type: String },
      timestamp: { type: String }
    },
    conditionReportAfter: {
      notes: { type: String },
      photos: [{ type: String }],
      verifiedBy: { type: String },
      timestamp: { type: String }
    },
    damageReport: {
      description: { type: String },
      photos: [{ type: String }],
      claimedAmount: { type: Number },
      reportedBy: { type: String },
      timestamp: { type: String }
    },
    beforePhotos: [{ type: String }],
    afterPhotos: [{ type: String }],
    conditionNotes: { type: String },
    damagePhotos: [{ type: String }],
    hasDisputeFlag: { type: Boolean, default: false },
    createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
  },
  {
    timestamps: true
  }
);
BookingSchema.index({ equipmentId: 1, status: 1, startDate: 1, endDate: 1 });
export const BookingModel = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
