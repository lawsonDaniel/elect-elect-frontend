"use server"
// pages/api/auth/staff/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import User from '@/models/user.model';
import { generateToken } from '@/utils/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const {
      surname,
      firstName,
      gender,
      rank,
      schoolEmail,
      staffId,
      password,
      repeatPassword
    } = req.body;

    // Validation
    if (!surname || !firstName || !gender || !rank || !schoolEmail || !staffId || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== repeatPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { schoolEmail },
        { staffId }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email or staff ID'
      });
    }

    // Create new staff user
    const user: any = new User({
      surname,
      firstName,
      gender,
      userType: 'staff',
      rank,
      schoolEmail,
      staffId,
      password,
      isActive: true,
      isEmailVerified: false // You might want to implement email verification later
    });

    await user.save();

    // Generate token - Fixed: Include userType in the payload
    const token = generateToken({
      userId: user._id.toString(),
      email: user.schoolEmail,
      userType: user.userType // Added this line
    });

    res.status(201).json({
      message: 'Staff registration successful',
      token,
      user: {
        id: user._id,
        surname: user.surname,
        firstName: user.firstName,
        fullName: user.fullName,
        gender: user.gender,
        userType: user.userType,
        rank: user.rank,
        schoolEmail: user.schoolEmail,
        staffId: user.staffId
      },
    });

  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `${field} already exists`
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}