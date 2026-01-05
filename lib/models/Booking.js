import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  tourSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'TourSlot', required: true },
  tourDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  numberOfTourists: { type: Number, required: true, min: 1, max: 50 },
  contactEmail: { type: String, required: true, lowercase: true, trim: true },
  status: { type: String, enum: ['pending', 'confirmed', 'contacted', 'cancelled'], default: 'pending' },
  notes: { type: String, default: '' },
}, { timestamps: true });

BookingSchema.index({ tourSlot: 1 });
BookingSchema.index({ tourDate: 1, startTime: 1 });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
