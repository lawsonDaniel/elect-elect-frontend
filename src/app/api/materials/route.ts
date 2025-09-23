import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Material from '@/models/material.model';
import jwt from 'jsonwebtoken';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

// POST: Upload new material to S3
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

    // Upload file to S3
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const uploadParams = {
      Bucket: bucketName,
      Key: `uploads/${fileName}`, // Store in 'uploads' folder in S3
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read', // Make file publicly accessible (adjust as needed)
    };

    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
    } catch (error) {
      console.error('S3 upload error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to upload file to S3' },
        { status: 500 }
      );
    }

    // Generate S3 file URL
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;

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

// GET handler remains unchanged
export { GET } from './original-file'; // Replace with your existing GET handler