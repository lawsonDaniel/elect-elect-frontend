// File: app/api/calendar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import CalendarEvent from '@/models/calendarEvent.model';
import jwt from 'jsonwebtoken';

async function verifyToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }

  const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production';
  const decoded = jwt.verify(token, jwtSecret) as any;
  return decoded;
}
export async function GET(request: NextRequest) {
  const user = await verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const events = await CalendarEvent.find({}).sort({ date: 1 });
    const grouped: { [key: string]: { date: string; title: string }[] } = {};
    events.forEach((event) => {
      const month = event.date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!grouped[month]) grouped[month] = [];
      const day = event.date.getDate();
      const suffix = ['th', 'st', 'nd', 'rd'][(day % 10) > 3 ? 0 : (day % 10)] || 'th';
      grouped[month].push({ date: `${day}${suffix}`, title: event.title });
    });
    const calendarEvents = Object.entries(grouped).map(([month, events]) => ({ month, events }));
    return NextResponse.json(calendarEvents);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
  }
}