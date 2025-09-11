import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import User from '@/models/user.model';
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

export async function PUT(request: NextRequest) {
  const userData = await verifyToken(request);
  if (!userData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const { emailNotifications, smsNotifications, pushNotifications } = await request.json();
    const user = await User.findById(userData.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.notificationPreferences = {
      emailNotifications: !!emailNotifications,
      smsNotifications: !!smsNotifications,
      pushNotifications: !!pushNotifications,
    };
    await user.save();

    return NextResponse.json({ message: 'Notification preferences updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update notification preferences' }, { status: 500 });
  }
}