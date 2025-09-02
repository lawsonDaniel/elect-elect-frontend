import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await request.json();
    const { 
      surname, 
      firstName, 
      gender, 
      dob, 
      schoolEmail, 
      mattNumber, 
      password, 
      level 
    } = body;

    // Check if user already exists with email or mattNumber
    const existingUserByEmail = await User.findOne({ schoolEmail });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const existingUserByMattNumber = await User.findOne({ mattNumber });
    if (existingUserByMattNumber) {
      return NextResponse.json(
        { error: 'User with this matriculation number already exists' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Create new student user
    const user = new User({
      surname,
      firstName,
      gender,
      dob: new Date(dob), // Convert string to Date object
      userType: 'student',
      schoolEmail,
      mattNumber,
      password,
      level,
    });

    // Save user to database
    await user.save();

    // Return success response (exclude password)
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(
      { message: 'Student user created successfully', user: userResponse },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Student registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      // Extract the field that caused the duplicate error
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}