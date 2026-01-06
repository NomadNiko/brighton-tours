import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Visitor from '@/lib/models/Visitor';
import SiteAnalytics from '@/lib/models/SiteAnalytics';

export async function POST(request) {
  try {
    const { visitorId, userAgent, referrer } = await request.json();
    
    if (!visitorId) {
      return NextResponse.json({ error: 'Visitor ID required' }, { status: 400 });
    }

    await connectDB();

    // Get IP and geo info from headers
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 'unknown';
    const country = request.headers.get('x-vercel-ip-country') || null;
    const region = request.headers.get('x-vercel-ip-country-region') || null;
    const city = request.headers.get('x-vercel-ip-city') || null;

    // Check if visitor exists in database
    const existing = await Visitor.findOne({ visitorId });
    
    if (existing) {
      // Returning visitor - update last visit and geo if missing
      existing.lastVisit = new Date();
      existing.visitCount += 1;
      if (!existing.ipAddress && ip !== 'unknown') existing.ipAddress = ip;
      if (!existing.country && country) existing.country = country;
      if (!existing.region && region) existing.region = region;
      if (!existing.city && city) existing.city = city;
      await existing.save();
      return NextResponse.json({ success: true, isNew: false });
    }

    // New visitor - create record and increment counter
    await Visitor.create({ 
      visitorId, 
      userAgent, 
      referrer,
      ipAddress: ip !== 'unknown' ? ip : null,
      country,
      region,
      city,
    });
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
