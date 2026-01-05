import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import TourSlot from '@/lib/models/TourSlot';

export async function GET(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || new Date().toISOString();
    const endDate = searchParams.get('endDate') || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

    await connectDB();

    const slots = await TourSlot.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ date: 1, startTime: 1 });

    return NextResponse.json({ success: true, data: slots });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get slots' }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { date, startTime, totalSpots, isActive, notes } = await request.json();

    if (!date || !startTime) {
      return NextResponse.json({ error: 'Date and start time are required' }, { status: 400 });
    }

    await connectDB();

    const tourDate = new Date(date);
    tourDate.setHours(0, 0, 0, 0);

    // Upsert: update if exists, create if not
    const slot = await TourSlot.findOneAndUpdate(
      { date: tourDate, startTime },
      { 
        totalSpots: totalSpots || 20, 
        isActive: isActive !== undefined ? isActive : true,
        notes: notes || '',
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: slot });
  } catch (error) {
    console.error('Create slot error:', error);
    return NextResponse.json({ error: 'Failed to create slot' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const slotId = searchParams.get('id');

    if (!slotId) {
      return NextResponse.json({ error: 'Slot ID required' }, { status: 400 });
    }

    await connectDB();
    await TourSlot.findByIdAndDelete(slotId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete slot' }, { status: 500 });
  }
}
