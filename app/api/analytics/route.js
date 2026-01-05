import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Visitor from '@/lib/models/Visitor';
import SiteAnalytics from '@/lib/models/SiteAnalytics';

export async function POST(request) {
  try {
    const { visitorId, isReturning, userAgent, referrer } = await request.json();
    
    if (!visitorId) {
      return NextResponse.json({ error: 'Visitor ID required' }, { status: 400 });
    }

    await connectDB();

    // Check if visitor exists in database
    const existing = await Visitor.findOne({ visitorId });
    
    if (existing) {
      // Returning visitor - update last visit
      existing.lastVisit = new Date();
      existing.visitCount += 1;
      await existing.save();
      return NextResponse.json({ success: true, isNew: false });
    }

    // New visitor - create record and increment counter
    await Visitor.create({ visitorId, userAgent, referrer });
    await SiteAnalytics.incrementVisitors();

    return NextResponse.json({ success: true, isNew: true });
  } catch (error) {
    console.error('Track visitor error:', error);
    return NextResponse.json({ error: 'Failed to track visitor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const stats = await SiteAnalytics.getStats();
    return NextResponse.json({ success: true, totalVisitors: stats.totalVisitors });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}
