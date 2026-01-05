import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import TourAvailability from '@/lib/models/TourAvailability';

export async function GET(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || new Date().toISOString();
    const endDate = searchParams.get('endDate') || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

    await connectDB();

    const availability = await TourAvailability.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ date: 1 });

    return NextResponse.json({ success: true, data: availability });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get availability' }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { date, isAvailable, totalSpots, notes } = await request.json();

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    await connectDB();

    const tourDate = new Date(date);
    tourDate.setHours(0, 0, 0, 0);

    const availability = await TourAvailability.findOneAndUpdate(
      { date: tourDate },
      { isAvailable, totalSpots: totalSpots || 20, notes: notes || '' },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: availability });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to set availability' }, { status: 500 });
  }
}
