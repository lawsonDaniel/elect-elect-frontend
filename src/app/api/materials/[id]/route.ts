// app/api/materials/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Material from '@/models/material.model';
import jwt from 'jsonwebtoken';
import { unlink } from 'fs/promises';
import { join } from 'path';

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

// GET: Fetch single material by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const material = await Material.findById(params.id)
      .populate('uploadedBy', 'firstName surname userType');

    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: material
    });

  } catch (error: any) {
    console.error('Get material error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch material' },
      { status: 500 }
    );
  }
}

// PUT: Update material
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request);
    await dbConnect();

    const body = await request.json();
    const { courseTitle, courseCode, materialType, description } = body;

    const material = await Material.findById(params.id);
    
    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to update (owner or admin)
    if (material.uploadedBy.toString() !== user.userId && user.userType !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Not authorized to update this material' },
        { status: 403 }
      );
    }

    // Update fields
    material.courseTitle = courseTitle || material.courseTitle;
    material.courseCode = courseCode ? courseCode.toUpperCase().trim() : material.courseCode;
    material.materialType = materialType || material.materialType;
    material.description = description || material.description;

    await material.save();
    await material.populate('uploadedBy', 'firstName surname userType');

    return NextResponse.json({
      success: true,
      message: 'Material updated successfully',
      data: material
    });

  } catch (error: any) {
    console.error('Update material error:', error);
    
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: errorMessages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update material' },
      { status: 500 }
    );
  }
}

// DELETE: Delete material
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request);
    await dbConnect();

    const material = await Material.findById(params.id);
    
    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to delete (owner or admin)
    if (material.uploadedBy.toString() !== user.userId && user.userType !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this material' },
        { status: 403 }
      );
    }

    // Delete file from filesystem
    try {
      const filePath = join(process.cwd(), 'public', material.fileUrl);
      await unlink(filePath);
    } catch (fileError) {
      console.warn('Could not delete file:', fileError);
    }

    await Material.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete material error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete material' },
      { status: 500 }
    );
  }
}