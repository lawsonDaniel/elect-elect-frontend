// app/api/auth/staff/register/route.ts
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
    const { surname, firstName, gender, schoolEmail, password, rank, staffId} = body;

    // Validate required fields
    if (!surname || !firstName || !gender || !schoolEmail || !password || !rank || !staffId ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password length before any database operations
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ 
      $or: [
        { schoolEmail },
        { staffId }
      ]
    });
    
    if (existingUser) {
      const field = existingUser.schoolEmail === schoolEmail ? 'email' : 'staff ID';
      return NextResponse.json(
        { error: `User with this ${field} already exists` },
        { status: 400 }
      );
    }

    // Check if user exists in Supabase (both email and staffId in one query)
    const { data: supabaseUsers, error: supabaseCheckError } = await supabase
      .from('profiles')
      .select('id, school_email, staff_id')
      .or(`school_email.eq.${schoolEmail},staff_id.eq.${staffId}`);

    if (supabaseCheckError) {
      console.error('Supabase check error:', supabaseCheckError);
      return NextResponse.json(
        { error: 'Failed to validate user data' },
        { status: 500 }
      );
    }

    if (supabaseUsers && supabaseUsers.length > 0) {
      const existingUser = supabaseUsers[0];
      const field = existingUser.school_email === schoolEmail ? 'email' : 'staff ID';
      return NextResponse.json(
        { error: `User with this ${field} already exists in the system` },
        { status: 400 }
      );
    }

    // ✅ 1. FIRST CREATE MONGODB USER (without supabase_user_id initially)
    const user = new User({
      surname,
      firstName,
      gender,
      userType: 'staff',
      schoolEmail,
      password, // This will be hashed by your User model
      rank,
      staffId,
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
        password: password,
        email_confirm: true,
        user_metadata: {
          mongo_user_id: user._id.toString(),
          user_type: 'staff'
        }
      });

      if (authError) {
        console.error('Supabase auth creation error:', authError);
        throw new Error(`Supabase auth failed: ${authError.message}`);
      }

      if (!authData?.user?.id) {
        throw new Error('Supabase auth user creation returned no user ID');
      }

      supabaseUserId = authData.user.id;

      // ✅ 3. CREATE PROFILE IN SUPABASE
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          mongo_user_id: user._id.toString(),
          surname,
          first_name: firstName,
          gender,
          user_type: 'staff',
          school_email: schoolEmail,
          rank,
          staff_id: staffId,
         
        });

      if (profileError) {
        console.error('Supabase profile creation error:', profileError);
        
        // Clean up the auth user if profile creation failed
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (cleanupError) {
          console.error('Failed to cleanup Supabase auth user:', cleanupError);
        }
        
        throw new Error(`Supabase profile creation failed: ${profileError.message}`);
      }

      // ✅ 4. UPDATE MONGODB USER WITH SUPABASE USER ID
      user.supabase_user_id = supabaseUserId;
      await user.save();

    } catch (supabaseError: any) {
      console.error('Supabase sync error:', supabaseError);
      supabaseSyncStatus = 'failed';
      
      // 🧹 ROLLBACK: Delete the MongoDB user since Supabase creation failed
      try {
        await User.findByIdAndDelete(user._id);
      } catch (rollbackError) {
        console.error('Failed to rollback MongoDB user:', rollbackError);
      }
      
      return NextResponse.json(
        { error: `Failed to create user in authentication system: ${supabaseError.message}` },
        { status: 500 }
      );
    }

    // Return success response (exclude password and other sensitive data)
    const userResponse = {
      _id: user._id,
      surname: user.surname,
      firstName: user.firstName,
      gender: user.gender,
      userType: user.userType,
      schoolEmail: user.schoolEmail,
      rank: user.rank,
      staffId: user.staffId,
      supabase_user_id: user.supabase_user_id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json(
      { 
        message: 'Staff user created successfully', 
        user: userResponse,
        supabase_sync: supabaseSyncStatus
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const fieldName = field === 'schoolEmail' ? 'email' : field === 'staffId' ? 'staff ID' : field;
      return NextResponse.json(
        { error: `${fieldName} already exists` },
        { status: 400 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON format in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}