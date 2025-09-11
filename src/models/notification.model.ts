import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  type: 'announcement' | 'event' | 'message' | 'payment' | 'other';
  title: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema({
  userId: {
    type: String, // Explicitly String
    required: true,
  },
  type: {
    type: String,
    enum: ['announcement', 'event', 'message', 'payment', 'other'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);