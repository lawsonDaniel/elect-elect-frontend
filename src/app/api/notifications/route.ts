import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Notification from '@/models/notification.model';
import jwt from 'jsonwebtoken';
import { supabase } from '@/utils/supabase/client';
import User from '@/models/user.model';

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
  try {
    const user = await verifyToken(request);
    await dbConnect();
    console.log("Fetching notifications for user:", user.userId);
    if (!user || !user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const notifications = await Notification.find({ userId: user.userId }).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch notifications' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { userId, type, title, content } = await request.json();

    // Validate userId
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Invalid userId format' }, { status: 400 });
    }

    // Find user by supabase_user_id
    const user = await User.findOne({ supabase_user_id: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found for provided userId' }, { status: 404 });
    }

    // Create notification
    const notification = await Notification.create({ userId:user?._id, type, title, content });

    // Real-time broadcast via Supabase
    await supabase.channel('notifications').send({
      type: 'broadcast',
      event: 'new_notification',
      payload: { userId, notification },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    await dbConnect();
    const { id } = await request.json();
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: user.userId },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json(notification);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}