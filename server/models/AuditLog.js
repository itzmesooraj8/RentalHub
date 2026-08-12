import mongoose, { Schema } from "mongoose";
const AuditLogSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    timestamp: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() },
    actorRole: { type: String, enum: ["customer", "owner", "admin", "system"], required: true },
    actorName: { type: String, required: true },
    action: { type: String, required: true },
    targetId: { type: String, required: true },
    metadata: { type: String }
  },
  {
    timestamps: true
  }
);
export const AuditLogModel = mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
