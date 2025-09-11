// app/api/materials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Material from '@/models/material.model';
import jwt from 'jsonwebtoken';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';

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

// GET: Fetch all materials with optional filtering
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const materialType = searchParams.get('materialType');
    const courseCode = searchParams.get('courseCode');
    const uploadedBy = searchParams.get('uploadedBy');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    console.log("searchParams.get('level')",searchParams.get('level'))
    // Build filter object
    const filter: any = {};
    if (level && level !== 'All Resources') filter.level = level;
    if (materialType) filter.materialType = materialType;
    if (courseCode) filter.courseCode = { $regex: courseCode, $options: 'i' };
    if (uploadedBy) filter.uploadedBy = uploadedBy;
    console.log("filter by",filter)
    // Fetch materials with pagination
    const materials = await Material.find(filter)
      .populate('uploadedBy', 'firstName surname userType')
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Material.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: materials,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error: any) {
    console.error('Get materials error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

// POST: Upload new material
export async function POST(request: NextRequest) {
  try {
    console.log("Reached upload endpoint");
    console.log("Headers:", request.headers.get("content-type"));

    // Verify authentication
    const user = await verifyToken(request);
    await dbConnect();

    // Parse form data
    let formData;
    try {
      formData = await request.formData();
    } catch (error) {
      console.error('FormData parsing error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to parse form data' },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File;
    const courseTitle = formData.get('courseTitle') as string;
    const courseCode = formData.get('courseCode') as string;
    const materialType = formData.get('materialType') as string;
    const description = formData.get('description') as string;
    const level = formData.get('level') as string;
    // Validate required fields
    if (!file || !courseTitle || !courseCode || !materialType || !description) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only PDF and DOCX files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });

    // Save file
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    // Create material document
    const material = new Material({
      courseTitle,
      courseCode: courseCode.toUpperCase().trim(),
      materialType,
      description,
      fileUrl,
      level,
      fileName: originalName,
      fileSize: file.size,
      uploadedBy: user.userId
    });

    await material.save();

    // Populate uploader for response
    await material.populate('uploadedBy', 'firstName surname userType');

    return NextResponse.json({
      success: true,
      message: 'Material uploaded successfully',
      data: material
    }, { status: 201 });

  } catch (error: any) {
    console.error('Upload material error:', error);

    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: errorMessages.join(', ') },
        { status: 400 }
      );
    }

    if (error.message === 'No token provided') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to upload material' },
      { status: 500 }
    );
  }
}


