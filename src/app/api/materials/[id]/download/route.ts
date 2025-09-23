// app/api/materials/[id]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Material from '@/models/material.model';
import { s3Client } from '@/utils/aws'; // Make sure you import your S3 client
import { GetObjectCommand } from '@aws-sdk/client-s3';

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

    // Extract the S3 key from the fileUrl
    // fileUrl format: https://bucketname.s3.region.amazonaws.com/uploads/filename
    const urlParts = material.fileUrl.split('/');
    const s3Key = `uploads/${urlParts[urlParts.length - 1]}`;
    
    // Get file from S3
    const getObjectParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
    };

    try {
      const command = new GetObjectCommand(getObjectParams);
      const s3Response = await s3Client.send(command);
      
      // Convert the S3 response body to buffer
      const chunks = [];
      const reader = s3Response.Body?.transformToWebStream().getReader();
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
      }
      
      const fileBuffer = Buffer.concat(chunks);

      // Set appropriate headers for file download
      const headers = new Headers();
      headers.set('Content-Type', s3Response.ContentType || 'application/octet-stream');
      headers.set('Content-Disposition', `attachment; filename="${material.fileName}"`);
      headers.set('Content-Length', fileBuffer.length.toString());

      return new NextResponse(fileBuffer, { headers });
      
    } catch (s3Error) {
      console.error('S3 download error:', s3Error);
      return NextResponse.json(
        { success: false, error: 'Failed to retrieve file from storage' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Download material error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to download material' },
      { status: 500 }
    );
  }
}