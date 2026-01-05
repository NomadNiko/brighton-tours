import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import Booking from '@/lib/models/Booking';
import TourSlot from '@/lib/models/TourSlot';
import { sendCancellationEmail } from '@/lib/utils/email';

// Cancel a single booking
export async function POST(request, { params }) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    const { message } = await request.json();

    await connectDB();

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json({ error: 'Booking already cancelled' }, { status: 400 });
    }

    // Release spots back to the pool
    await TourSlot.findByIdAndUpdate(booking.tourSlot, {
      $inc: { bookedSpots: -booking.numberOfTourists }
    });

    // Update booking status
    booking.status = 'cancelled';
    booking.notes = `Cancelled: ${message}`;
    await booking.save();

    // Send cancellation email
    await sendCancellationEmail({
      to: booking.contactEmail,
      tourDate: booking.tourDate,
      startTime: booking.startTime,
      numberOfTourists: booking.numberOfTourists,
      message,
    });

    return NextResponse.json({ success: true, message: 'Booking cancelled and email sent' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
