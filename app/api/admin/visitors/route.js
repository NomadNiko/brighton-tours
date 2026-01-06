import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import Visitor from '@/lib/models/Visitor';

export async function GET(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = (page - 1) * limit;

    await connectDB();

    const [visitors, total, countryStats, referrerStats, dailyStats] = await Promise.all([
      Visitor.find().sort({ lastVisit: -1 }).skip(skip).limit(limit).lean(),
      Visitor.countDocuments(),
      Visitor.aggregate([
        { $match: { country: { $ne: null } } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Visitor.aggregate([
        { $match: { referrer: { $ne: null, $ne: '' } } },
        { $group: { _id: '$referrer', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Visitor.aggregate([
        { $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$firstVisit' } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: -1 } },
        { $limit: 30 }
      ])
    ]);

    return NextResponse.json({
      success: true,
      data: {
        visitors,
        total,
        page,
        pages: Math.ceil(total / limit),
        countryStats,
        referrerStats,
        dailyStats: dailyStats.reverse(),
      }
    });
  } catch (error) {
    console.error('Visitors API error:', error);
    return NextResponse.json({ error: 'Failed to get visitors' }, { status: 500 });
  }
}
