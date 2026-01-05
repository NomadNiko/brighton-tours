import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import SiteAnalytics from '@/lib/models/SiteAnalytics';
import Visitor from '@/lib/models/Visitor';
import Booking from '@/lib/models/Booking';

export async function GET(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorized();

  try {
    await connectDB();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Count visitors directly from Visitor collection as backup
    const [stats, totalVisitorsCount, recentVisitors, returningVisitors, totalBookings, pendingBookings] = await Promise.all([
      SiteAnalytics.getStats(),
      Visitor.countDocuments(),
      Visitor.countDocuments({ firstVisit: { $gte: thirtyDaysAgo } }),
      Visitor.countDocuments({ visitCount: { $gt: 1 } }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
    ]);

    // Use the higher of the two counts (in case they got out of sync)
    const totalUniqueVisitors = Math.max(stats.totalVisitors, totalVisitorsCount);

    return NextResponse.json({
      success: true,
      data: {
        totalUniqueVisitors,
        recentVisitors30Days: recentVisitors,
        returningVisitors,
        totalBookings,
        pendingBookings,
        lastUpdated: stats.lastUpdated,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 });
  }
}
