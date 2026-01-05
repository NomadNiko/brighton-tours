import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import Booking from '@/lib/models/Booking';

export async function GET(request, { params }) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { slotId } = await params;
    await connectDB();

    const bookings = await Booking.find({ tourSlot: slotId }).sort({ createdAt: 1 });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get bookings' }, { status: 500 });
  }
}
