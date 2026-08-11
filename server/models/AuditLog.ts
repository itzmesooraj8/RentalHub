import mongoose, { Schema, Model } from 'mongoose';

export interface IAuditLog {
  id: string;
  timestamp: string;
  actorRole: 'customer' | 'owner' | 'admin' | 'system';
  actorName: string;
  action: string;
  targetId: string;
  metadata?: string;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    id: { type: String, required: true, unique: true, index: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
    actorRole: { type: String, enum: ['customer', 'owner', 'admin', 'system'], required: true },
    actorName: { type: String, required: true },
    action: { type: String, required: true },
    targetId: { type: String, required: true },
    metadata: { type: String },
  },
  {
    timestamps: true,
  }
);

export const AuditLogModel: Model<IAuditLog> =
  (mongoose.models.AuditLog as Model<IAuditLog>) || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
