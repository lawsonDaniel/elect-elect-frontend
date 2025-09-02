// app/api/auth/staff/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await request.json();
    const { surname, firstName, gender, schoolEmail, password, rank, staffId, department, faculty } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ schoolEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new staff user
    const user = new User({
      surname,
      firstName,
      gender,
      userType: 'staff',
      schoolEmail,
      password,
      rank,
      staffId,
      department,
      faculty,
    });

    // Save user to database
    await user.save();

    // Return success response (exclude password)
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(
      { message: 'Staff user created successfully', user: userResponse },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate field value entered' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}