import mongoose, { Schema, Model } from 'mongoose';
import { Notification as NotificationType } from '../../src/types';

const NotificationSchema = new Schema<NotificationType>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['booking_request', 'booking_confirmed', 'return_reminder', 'dispute_alert', 'system'], required: true },
    read: { type: Boolean, default: false, index: true },
    link: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);

export const NotificationModel: Model<NotificationType> =
  (mongoose.models.Notification as Model<NotificationType>) ||
  mongoose.model<NotificationType>('Notification', NotificationSchema);
