import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import Booking from '@/lib/models/Booking';
import TourSlot from '@/lib/models/TourSlot';
import { sendBookingConfirmationEmail } from '@/lib/utils/email';

// Reinstate a cancelled booking
export async function POST(request, { params }) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { id } = await params;

    await connectDB();

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status !== 'cancelled') {
      return NextResponse.json({ error: 'Booking is not cancelled' }, { status: 400 });
    }

    // Check if slot still exists and has capacity
    const slot = await TourSlot.findById(booking.tourSlot);
    if (!slot) {
      return NextResponse.json({ error: 'Tour slot no longer exists' }, { status: 400 });
    }

    if (slot.remainingSpots < booking.numberOfTourists) {
      return NextResponse.json({ 
        error: `Not enough spots available. Only ${slot.remainingSpots} remaining.` 
      }, { status: 400 });
    }

    // Reinstate booking
    booking.status = 'pending';
    booking.notes = `Reinstated on ${new Date().toLocaleDateString()}. Previous: ${booking.notes}`;
    await booking.save();

    // Add spots back to slot
    slot.bookedSpots += booking.numberOfTourists;
    await slot.save();

    // Send confirmation email again
    await sendBookingConfirmationEmail({
      to: booking.contactEmail,
      tourDate: booking.tourDate,
      startTime: booking.startTime,
      numberOfTourists: booking.numberOfTourists,
    });

    return NextResponse.json({ success: true, message: 'Booking reinstated and confirmation email sent' });
  } catch (error) {
    console.error('Reinstate booking error:', error);
    return NextResponse.json({ error: 'Failed to reinstate booking' }, { status: 500 });
  }
}
