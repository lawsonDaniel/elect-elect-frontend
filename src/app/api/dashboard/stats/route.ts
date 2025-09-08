// File: app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
// Note: This is a placeholder. In a real app, derive from DB (e.g., user enrollments, material downloads).
import jwt from 'jsonwebtoken';
// Helper function to verify JWT token
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
// Verify authentication
    const user = await verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Placeholder hardcoded stats (replace with real queries in production)
  const stats = [
    { title: 'Courses Enrolled', value: 20, sub: 'This Session', border: 'border-blue-400' },
    { title: 'Downloads', value: 30, sub: 'This Session', border: 'border-orange-300' },
    { title: 'Upcoming Classes', value: 5, sub: 'This Week', border: 'border-red-300' },
    { title: 'Payment Status', value: 'Dues Payment', sub: 'Pending', border: 'border-yellow-400', isBold: true },
  ];

  return NextResponse.json(stats);
}