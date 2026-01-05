import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TourSlot from '@/lib/models/TourSlot';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || new Date().toISOString();
    const endDate = searchParams.get('endDate') || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

    await connectDB();

    const slots = await TourSlot.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      isActive: true,
    }).sort({ date: 1, startTime: 1 });

    // Group by date
    const dateMap = {};
    slots.forEach(slot => {
      const dateKey = slot.date.toISOString().split('T')[0];
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { date: dateKey, slots: [], hasAvailability: false };
      }
      const slotData = {
        id: slot._id,
        startTime: slot.startTime,
        totalSpots: slot.totalSpots,
        bookedSpots: slot.bookedSpots,
        remainingSpots: slot.remainingSpots,
        isFull: slot.isFull,
      };
      dateMap[dateKey].slots.push(slotData);
      if (!slot.isFull) {
        dateMap[dateKey].hasAvailability = true;
      }
    });

    return NextResponse.json({ success: true, data: Object.values(dateMap) });
  } catch (error) {
    console.error('Get available dates error:', error);
    return NextResponse.json({ error: 'Failed to get available dates' }, { status: 500 });
  }
}
