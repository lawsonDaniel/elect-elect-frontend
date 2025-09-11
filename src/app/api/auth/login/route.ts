import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import User from '@/models/user.model';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ 
      schoolEmail: email.toLowerCase().trim() 
    }).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if password matches
    let isPasswordValid = false;
    try {
      if (typeof user.comparePassword === 'function') {
        isPasswordValid = await user.comparePassword(password);
      } else {
        const bcrypt = await import('bcryptjs');
        isPasswordValid = await bcrypt.compare(password, user.password);
      }
    } catch (compareError) {
      console.error('Password comparison error:', compareError);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      );
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token (for your existing auth system)
    const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production';
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.schoolEmail,
        userType: user.userType
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Create user response without password
    const userResponse = user.toObject();
    delete userResponse.password;

    // Set HTTP-only cookie with token
    const response = NextResponse.json(
      { 
        message: 'Login successful', 
        user: userResponse,
        token 
      },
      { status: 200 }
    );

    // Set cookie with token (HTTP-only for security)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.name === 'MongoError') {
      return NextResponse.json(
        { error: 'Database error. Please try again later.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}