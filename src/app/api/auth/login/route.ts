import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import User from '@/models/user.model';
import jwt from 'jsonwebtoken';
import { supabase } from '@/utils/supabase/client';

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

    // ✅ SUPABASE AUTHENTICATION - Sign in user with Supabase
    const { error: supabaseError } = await supabase.auth.signInWithPassword({
      email: user.schoolEmail,
      password: password, // Use the same password or consider a different approach
    });

    if (supabaseError) {
      console.error('Supabase authentication error:', supabaseError);
      
      // If user doesn't exist in Supabase, create them
      if (supabaseError.message === 'Invalid login credentials') {
        const { error: signUpError } = await supabase.auth.signUp({
          email: user.schoolEmail,
          password: password,
          options: {
            data: {
              first_name: user.firstName,
              surname: user.surname,
              user_type: user.userType,
              level: user.level
            }
          }
        });

        if (signUpError) {
          console.error('Supabase signup error:', signUpError);
          return NextResponse.json(
            { error: 'Authentication setup failed' },
            { status: 500 }
          );
        }

        // If signup was successful, try to sign in again
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email: user.schoolEmail,
          password: password,
        });

        if (retryError) {
          console.error('Retry Supabase authentication error:', retryError);
          return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 500 }
        );
      }
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

    // Also set Supabase auth cookie if needed
    // Note: Supabase usually handles its own cookies automatically

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