import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Booking from '@/lib/models/Booking';
import TourSlot from '@/lib/models/TourSlot';
import { sendBookingConfirmationEmail, sendBookingAdminNotification } from '@/lib/utils/email';

export async function POST(request) {
  try {
    const { slotId, numberOfTourists, contactEmail } = await request.json();

    if (!slotId || !numberOfTourists || !contactEmail) {
      return NextResponse.json(
        { error: 'Please provide slot, number of tourists, and contact email' },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(contactEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await connectDB();

    // Find the slot and check availability
    const slot = await TourSlot.findById(slotId);
    if (!slot) {
      return NextResponse.json({ error: 'Tour slot not found' }, { status: 404 });
    }

    if (!slot.isActive) {
      return NextResponse.json({ error: 'This tour slot is no longer available' }, { status: 400 });
    }

    if (slot.remainingSpots < numberOfTourists) {
      return NextResponse.json({ 
        error: `Only ${slot.remainingSpots} spots remaining for this time slot` 
      }, { status: 400 });
    }

    // Create booking
    const booking = await Booking.create({
      tourSlot: slot._id,
      tourDate: slot.date,
      startTime: slot.startTime,
      numberOfTourists,
      contactEmail: contactEmail.toLowerCase().trim(),
    });

    // Update slot booked count
    slot.bookedSpots += numberOfTourists;
    await slot.save();

    // Send confirmation email to customer
    await sendBookingConfirmationEmail({
      to: contactEmail.toLowerCase().trim(),
      tourDate: slot.date,
      startTime: slot.startTime,
      numberOfTourists,
    });

    // Notify admin of new booking
    await sendBookingAdminNotification({
      tourDate: slot.date,
      startTime: slot.startTime,
      numberOfTourists,
      contactEmail: contactEmail.toLowerCase().trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Tours are not currently running, but will resume soon. We will reach out with more information.',
      booking: {
        id: booking._id,
        date: slot.date,
        startTime: slot.startTime,
        numberOfTourists,
      },
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Failed to submit booking' }, { status: 500 });
  }
}
