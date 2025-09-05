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

    // ✅ 1. FIRST CREATE MONGODB USER (without supabase_user_id initially)
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
      // supabase_user_id will be added after Supabase user is created
    });

    // Save user to MongoDB first
    await user.save();

    let supabaseSyncStatus = 'completed';
    let supabaseUserId: string | null = null;

    try {
      // ✅ 2. NOW CREATE SUPABASE AUTH USER (using the already-created MongoDB user._id)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: schoolEmail,
        password: password, // Use the actual password provided by user
        email_confirm: true,
        user_metadata: {
          mongo_user_id: user._id.toString(), // Now user is defined
          user_type: 'student'
        }
      });

      if (authError) {
        console.error('Supabase auth creation error:', authError);
        throw new Error(`Supabase auth failed: ${authError.message}`);
      }

      supabaseUserId = authData.user.id;

      // ✅ 3. CREATE PROFILE IN SUPABASE
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
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
        // Clean up the auth user if profile creation failed
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Supabase profile creation failed: ${profileError.message}`);
      }

      // ✅ 4. UPDATE MONGODB USER WITH SUPABASE USER ID
      user.supabase_user_id = supabaseUserId;
      await user.save();

    } catch (supabaseError: any) {
      console.error('Supabase sync error:', supabaseError);
      supabaseSyncStatus = 'failed';
      
      // 🧹 ROLLBACK: Delete the MongoDB user since Supabase creation failed
      await User.findByIdAndDelete(user._id);
      
      return NextResponse.json(
        { error: `Failed to create user in authentication system: ${supabaseError.message}` },
        { status: 500 }
      );
    }

    // Return success response (exclude password)
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(
      { 
        message: 'Student user created successfully', 
        user: userResponse,
        supabase_sync: supabaseSyncStatus
      },
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