// app/api/materials/[id]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Material from '@/models/material.model';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const material = await Material.findById(params.id);
    
    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      );
    }

    // Increment download count
    material.downloads += 1;
    await material.save();

    // Read file
    const filePath = join(process.cwd(), 'public', material.fileUrl);
    const fileBuffer = await readFile(filePath);

    // Set appropriate headers for file download
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${material.fileName}"`);
    headers.set('Content-Length', fileBuffer.length.toString());

    return new NextResponse(fileBuffer, { headers });

  } catch (error: any) {
    console.error('Download material error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to download material' },
      { status: 500 }
    );
  }
}
