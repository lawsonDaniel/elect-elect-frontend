// File: app/api/announcements/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Announcement from '@/models/announcement.model';
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
    const announcements = await Announcement.find({}).sort({ createdAt: -1 }).limit(10);
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}