// app/api/auth/student/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import User from '@/models/user.model';
import { supabase } from '@/utils/supabase/client';

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

    // Check if user already exists with email or mattNumber in MongoDB
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

    // Check if user exists in Supabase
    const { data: supabaseUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('school_email', schoolEmail)
      .single();

    if (supabaseUser) {
      return NextResponse.json(
        { error: 'User with this email already exists in the system' },
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

    // ✅ 1. CREATE NORMAL SUPABASE USER (not admin)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: schoolEmail,
      password: password,
      options: {
        data: {
          user_type: 'student',
          surname,
          first_name: firstName
        }
      }
    });

    if (authError) {
      console.error('Supabase auth creation error:', authError);
      return NextResponse.json(
        { error: `Failed to create user account: ${authError.message}` },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }
    console.log('Supabase auth user created', authData.user);
    const supabaseUserId = authData.user.id;

    try {
      // ✅ 2. CREATE MONGODB USER WITH SUPABASE USER ID
      const user = new User({
        surname,
        firstName,
        gender,
        dob: new Date(dob),
        userType: 'student',
        schoolEmail,
        mattNumber,
        password, // This will be hashed by your User model
        level,
        supabase_user_id: supabaseUserId // Save Supabase user ID
      });

      // Save user to MongoDB
      await user.save();

      // ✅ 3. CREATE PROFILE IN SUPABASE
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: supabaseUserId,
          mongo_user_id: user._id.toString(), // Reference to MongoDB
          surname,
          first_name: firstName,
          gender,
          user_type: 'student',
          school_email: schoolEmail,
          date_of_birth: new Date(dob),
          matt_number: mattNumber,
          level
        });

      if (profileError) {
        console.error('Supabase profile creation error:', profileError);
        // Clean up MongoDB user if profile creation failed
        await User.findByIdAndDelete(user._id);
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }

      // Return success response (exclude password)
      const userResponse = user.toObject();
      delete userResponse.password;

      return NextResponse.json(
        { 
          message: 'Student user created successfully', 
          user: userResponse,
          supabase_user_id: supabaseUserId,
          email_confirmation_sent: !authData.session // If no session, email confirmation is required
        },
        { status: 201 }
      );

    } catch (mongoError: any) {
      console.error('MongoDB user creation error:', mongoError);
      
      // Clean up Supabase user if MongoDB creation failed
      // Note: For normal users, you might need admin privileges to delete
      // Or implement a cleanup mechanism
      
      if (mongoError.name === 'ValidationError') {
        const errors = Object.values(mongoError.errors).map((err: any) => err.message);
        return NextResponse.json(
          { error: 'Validation failed', details: errors },
          { status: 400 }
        );
      }

      if (mongoError.code === 11000) {
        const field = Object.keys(mongoError.keyValue)[0];
        return NextResponse.json(
          { error: `${field} already exists` },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to save user data' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Student registration error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}