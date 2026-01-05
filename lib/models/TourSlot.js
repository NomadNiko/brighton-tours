import mongoose from 'mongoose';

const TourSlotSchema = new mongoose.Schema({
  date: { type: Date, required: true, index: true },
  startTime: { type: String, required: true }, // "10:00", "14:00", etc.
  totalSpots: { type: Number, required: true, min: 1, max: 100, default: 20 },
  bookedSpots: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true },
  notes: { type: String, default: '' },
}, { timestamps: true });

// Compound unique index: one slot per date+time
TourSlotSchema.index({ date: 1, startTime: 1 }, { unique: true });

TourSlotSchema.virtual('remainingSpots').get(function() {
  return Math.max(0, this.totalSpots - this.bookedSpots);
});

TourSlotSchema.virtual('isFull').get(function() {
  return this.bookedSpots >= this.totalSpots;
});

TourSlotSchema.set('toJSON', { virtuals: true });

export default mongoose.models.TourSlot || mongoose.model('TourSlot', TourSlotSchema);
