// app/api/materials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Material from '@/models/material.model';
import jwt from 'jsonwebtoken';
import {  PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/utils/aws';

// Initialize S3 Client

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
// POST: Upload new material to S3
export async function POST(request: NextRequest) {
  try {
    console.log("Reached upload endpoint");
    console.log("Headers:", request.headers.get("content-type"));

    // Verify authentication
    const user = await verifyToken(request);
    console.log("Authenticated user:", user);
    await dbConnect();
    console.log("Database connected");

    // Parse form data
    let formData;
    try {
      formData = await request.formData();
      console.log("Form data parsed successfully");
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
    console.log("Form data extracted:", { courseTitle, courseCode, materialType, description, level, fileName: file?.name });

    // Validate required fields
    if (!file || !courseTitle || !courseCode || !materialType || !description) {
      console.log("Missing required fields");
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
      console.log("Invalid file type:", file.type);
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only PDF and DOCX files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      console.log("File size too large:", file.size);
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("File converted to buffer, size:", buffer.length);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;
    console.log("Generated filename:", fileName);

    // Upload file to S3
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const uploadParams: any = {
      Bucket: bucketName,
      Key: `uploads/${fileName}`,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
    };
    console.log("S3 upload params prepared:", { bucket: bucketName, key: `uploads/${fileName}` });

    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
      console.log("File uploaded to S3 successfully");
    } catch (error) {
      console.error('S3 upload error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to upload file to S3' },
        { status: 500 }
      );
    }

    // Generate S3 file URL
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;
    console.log("Generated S3 file URL:", fileUrl);

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
    console.log("Material document created:", material);

    await material.save();
    console.log("Material saved to database");

    // Populate uploader for response
    await material.populate('uploadedBy', 'firstName surname userType');
    console.log("Uploader populated:", material.uploadedBy);

    return NextResponse.json({
      success: true,
      message: 'Material uploaded successfully',
      data: material
    }, { status: 201 });

  } catch (error: any) {
    console.error('Upload material error:', error);

    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((err: any) => err.message);
      console.log("Validation errors:", errorMessages);
      return NextResponse.json(
        { success: false, error: errorMessages.join(', ') },
        { status: 400 }
      );
    }

    if (error.message === 'No token provided') {
      console.log("Authentication failed: No token provided");
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log("Unexpected error during upload");
    return NextResponse.json(
      { success: false, error: 'Failed to upload material' },
      { status: 500 }
    );
  }
}


