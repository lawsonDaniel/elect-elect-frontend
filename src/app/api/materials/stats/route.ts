// app/api/materials/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Material from '@/models/material.model';
import { Types } from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const matchStage: any = {};
    if (userId) matchStage.uploadedBy = new Types.ObjectId(userId);

    // Get statistics
    const stats = await Material.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: null,
          totalMaterials: { $sum: 1 },
          totalDownloads: { $sum: '$downloads' },
          averageDownloads: { $avg: '$downloads' },
          materialsByType: {
            $push: {
              type: '$materialType',
              downloads: '$downloads'
            }
          },
          materialsByLevel: {
            $push: {
              level: '$level',
              downloads: '$downloads'
            }
          }
        }
      }
    ]);

    // Get materials by type statistics
    const materialsByType = await Material.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: '$materialType',
          count: { $sum: 1 },
          totalDownloads: { $sum: '$downloads' }
        }
      }
    ]);

    // Get materials by level statistics  
    const materialsByLevel = await Material.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 },
          totalDownloads: { $sum: '$downloads' }
        }
      }
    ]);

    // Get recent uploads
    const recentUploads = await Material.find(matchStage)
      .populate('uploadedBy', 'firstName surname')
      .sort({ uploadDate: -1 })
      .limit(5);

    return NextResponse.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalMaterials: 0,
          totalDownloads: 0,
          averageDownloads: 0
        },
        materialsByType,
        materialsByLevel,
        recentUploads
      }
    });

  } catch (error: any) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}