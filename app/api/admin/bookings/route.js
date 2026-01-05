import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import Booking from '@/lib/models/Booking';

export async function GET(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    await connectDB();

    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Booking.countDocuments(query),
    ]);

    return NextResponse.json({ success: true, data: bookings, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get bookings' }, { status: 500 });
  }
}
