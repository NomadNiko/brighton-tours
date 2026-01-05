import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import Booking from '@/lib/models/Booking';

export async function PUT(request, { params }) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    const { status, notes } = await request.json();

    await connectDB();

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (status) booking.status = status;
    if (notes !== undefined) booking.notes = notes;
    await booking.save();

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
