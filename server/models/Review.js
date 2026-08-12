import mongoose, { Schema } from "mongoose";
const ReviewSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    equipmentId: { type: String, required: true, index: true },
    fromUserId: { type: String, required: true },
    fromUserName: { type: String, required: true },
    fromUserAvatar: { type: String },
    fromRole: { type: String, enum: ["customer", "owner"], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
  },
  {
    timestamps: true
  }
);
export const ReviewModel = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
