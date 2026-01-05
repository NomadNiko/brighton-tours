import mongoose from 'mongoose';

const TourAvailabilitySchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true, index: true },
  isAvailable: { type: Boolean, default: false },
  totalSpots: { type: Number, default: 20, min: 0, max: 100 },
  bookedSpots: { type: Number, default: 0, min: 0 },
  notes: { type: String, default: '' },
}, { timestamps: true });

TourAvailabilitySchema.virtual('remainingSpots').get(function() {
  return Math.max(0, this.totalSpots - this.bookedSpots);
});

TourAvailabilitySchema.set('toJSON', { virtuals: true });

export default mongoose.models.TourAvailability || mongoose.model('TourAvailability', TourAvailabilitySchema);
