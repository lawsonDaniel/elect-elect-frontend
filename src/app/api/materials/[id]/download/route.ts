// app/api/materials/[id]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Material from '@/models/material.model';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise to get the actual parameters
    const { id } = await params;
    
    await dbConnect();
    
    const material = await Material.findById(id);
    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      );
    }

    // Increment download count
    material.downloads += 1;
    await material.save();

    // Since files are public in S3, just redirect to the URL
    return NextResponse.redirect(material.fileUrl);

  } catch (error: any) {
    console.error('Download material error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to download material' },
      { status: 500 }
    );
  }
}