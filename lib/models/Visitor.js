import mongoose from 'mongoose';
import crypto from 'crypto';

const VisitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, unique: true, index: true },
  firstVisit: { type: Date, default: Date.now },
  lastVisit: { type: Date, default: Date.now },
  visitCount: { type: Number, default: 1 },
  ipAddress: String,
  userAgent: String,
  referrer: String,
}, { timestamps: true });

VisitorSchema.statics.generateId = function(ip, userAgent) {
  return crypto.createHash('sha256').update(`${ip}-${userAgent}`).digest('hex');
};

export default mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
