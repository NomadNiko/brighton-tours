import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyAdmin, unauthorized } from '@/lib/auth';
import Booking from '@/lib/models/Booking';
import TourSlot from '@/lib/models/TourSlot';
import { sendCancellationEmail } from '@/lib/utils/email';

// Cancel entire slot and all its bookings - uses BCC for single email
export async function POST(request, { params }) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { slotId } = await params;
    const { message } = await request.json();

    await connectDB();

    const slot = await TourSlot.findById(slotId);
    if (!slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    // Get all active bookings for this slot
    const bookings = await Booking.find({ tourSlot: slotId, status: { $ne: 'cancelled' } });

    if (bookings.length > 0) {
      // Collect all unique emails for BCC
      const emails = [...new Set(bookings.map(b => b.contactEmail))];
      
      // Send single email with BCC to all recipients
      await sendCancellationEmail({
        to: emails[0], // Primary recipient
        bcc: emails.slice(1), // Rest as BCC
        tourDate: slot.date,
        startTime: slot.startTime,
        message,
      });
    }

    // Mark all bookings as cancelled
    await Booking.updateMany(
      { tourSlot: slotId, status: { $ne: 'cancelled' } },
      { $set: { status: 'cancelled', notes: `Slot cancelled: ${message}` } }
    );

    // Deactivate the slot and reset booked spots
    slot.isActive = false;
    slot.bookedSpots = 0;
    await slot.save();

    return NextResponse.json({ 
      success: true, 
      message: `Slot cancelled. ${bookings.length} booking(s) notified.`,
      emailsSent: bookings.length,
    });
  } catch (error) {
    console.error('Cancel slot error:', error);
    return NextResponse.json({ error: 'Failed to cancel slot' }, { status: 500 });
  }
}
