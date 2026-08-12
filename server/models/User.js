import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, select: false },
    avatar: { type: String },
    role: { type: String, enum: ["customer", "owner", "admin"], default: "customer", index: true },
    phone: { type: String },
    location: { type: String },
    bio: { type: String },
    trustScore: { type: Number, default: 95 },
    kycStatus: { type: String, enum: ["unverified", "pending", "verified", "rejected"], default: "unverified" },
    kycVerified: { type: Boolean, default: false },
    kycDocUrl: { type: String },
    completedRentalsCount: { type: Number, default: 0 },
    onTimeReturnRate: { type: Number, default: 100 },
    memberSince: { type: String, default: () => (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
    favorites: [{ type: String }],
    createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
  },
  {
    timestamps: true
  }
);
export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
