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

    // Validate required fields
    if (!surname || !firstName || !gender || !dob || !schoolEmail || !mattNumber || !password || !level) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password length before any operations
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Validate date format
    const dateOfBirth = new Date(dob);
    if (isNaN(dateOfBirth.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date of birth format' },
        { status: 400 }
      );
    }

    // Validate email format (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(schoolEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists in MongoDB (combined query)
    const existingUser = await User.findOne({ 
      $or: [
        { schoolEmail },
        { mattNumber }
      ]
    });
    
    if (existingUser) {
      const field = existingUser.schoolEmail === schoolEmail ? 'email' : 'matriculation number';
      return NextResponse.json(
        { error: `User with this ${field} already exists` },
        { status: 400 }
      );
    }

    // Check if user exists in Supabase (both email and mattNumber)
    const { data: supabaseUsers, error: supabaseCheckError } = await supabase
      .from('profiles')
      .select('id, school_email, matt_number')
      .or(`school_email.eq.${schoolEmail},matt_number.eq.${mattNumber}`);

    if (supabaseCheckError) {
      console.error('Supabase check error:', supabaseCheckError);
      return NextResponse.json(
        { error: 'Failed to validate user data' },
        { status: 500 }
      );
    }

    if (supabaseUsers && supabaseUsers.length > 0) {
      const existingUser = supabaseUsers[0];
      const field = existingUser.school_email === schoolEmail ? 'email' : 'matriculation number';
      return NextResponse.json(
        { error: `User with this ${field} already exists in the system` },
        { status: 400 }
      );
    }

    // ✅ 1. CREATE SUPABASE AUTH USER
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: schoolEmail,
      password: password,
      options: {
        data: {
          user_type: 'student',
          surname,
          first_name: firstName,
          matt_number: mattNumber
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

    if (!authData?.user?.id) {
      return NextResponse.json(
        { error: 'Failed to create user account - no user ID returned' },
        { status: 500 }
      );
    }

    console.log('Supabase auth user created:', authData.user.id);
    const supabaseUserId = authData.user.id;

    // Variables to track creation status
    let mongoUser: any = null;
    let profileCreated = false;

    try {
      // ✅ 2. CREATE MONGODB USER WITH SUPABASE USER ID
      const user = new User({
        surname,
        firstName,
        gender,
        dob: dateOfBirth,
        userType: 'student',
        schoolEmail,
        mattNumber,
        password, // This will be hashed by your User model
        level,
        supabase_user_id: supabaseUserId
      });

      // Save user to MongoDB
      await user.save();
      mongoUser = user;
      console.log('MongoDB user created:', user._id);

      // ✅ 3. CREATE PROFILE IN SUPABASE
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: supabaseUserId,
          mongo_user_id: user._id.toString(),
          surname,
          first_name: firstName,
          gender,
          user_type: 'student',
          school_email: schoolEmail,
          date_of_birth: dateOfBirth.toISOString(),
          matt_number: mattNumber,
          level: parseInt(level) // Ensure level is stored as number
        });

      if (profileError) {
        console.error('Supabase profile creation error:', profileError);
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }

      profileCreated = true;
      console.log('Supabase profile created successfully');

      // Return success response with explicit field selection
      const userResponse = {
        _id: user._id,
        surname: user.surname,
        firstName: user.firstName,
        gender: user.gender,
        dob: user.dob,
        userType: user.userType,
        schoolEmail: user.schoolEmail,
        mattNumber: user.mattNumber,
        level: user.level,
        supabase_user_id: user.supabase_user_id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      return NextResponse.json(
        { 
          message: 'Student user created successfully', 
          user: userResponse,
          supabase_user_id: supabaseUserId,
          email_confirmation_sent: !authData.session // If no session, email confirmation is required
        },
        { status: 201 }
      );

    } catch (createError: any) {
      console.error('User creation error:', createError);
      
      // 🧹 COMPREHENSIVE CLEANUP
      const cleanupPromises = [];

      // Clean up MongoDB user if it was created
      if (mongoUser) {
        cleanupPromises.push(
          User.findByIdAndDelete(mongoUser._id).catch(err => 
            console.error('Failed to cleanup MongoDB user:', err)
          )
        );
      }

      // Clean up Supabase profile if it was created
      if (profileCreated) {
        cleanupPromises.push(
          supabase
            .from('profiles')
            .delete()
            .eq('id', supabaseUserId)
            .then(({ error }) => {
              if (error) console.error('Failed to cleanup Supabase profile:', error);
            })
        );
      }

      // Note: Cleaning up Supabase auth user is tricky with signUp
      // You might need admin privileges or implement a background cleanup job
      // For now, we'll log it for manual cleanup if needed
      console.warn(`Supabase auth user ${supabaseUserId} may need manual cleanup`);

      // Wait for cleanup operations
      await Promise.allSettled(cleanupPromises);

      // Handle specific error types
      if (createError.name === 'ValidationError') {
        const errors = Object.values(createError.errors).map((err: any) => err.message);
        return NextResponse.json(
          { error: 'Validation failed', details: errors },
          { status: 400 }
        );
      }

      if (createError.code === 11000) {
        const field = Object.keys(createError.keyValue)[0];
        const fieldName = field === 'schoolEmail' ? 'email' : 
                         field === 'mattNumber' ? 'matriculation number' : field;
        return NextResponse.json(
          { error: `${fieldName} already exists` },
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