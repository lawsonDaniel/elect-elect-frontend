// File: models/calendarEvent.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICalendarEvent extends Document {
  date: Date;
  title: string;
}

const calendarEventSchema = new Schema<ICalendarEvent>(
  {
    date: { type: Date, required: true },
    title: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.CalendarEvent || mongoose.model<ICalendarEvent>('CalendarEvent', calendarEventSchema);