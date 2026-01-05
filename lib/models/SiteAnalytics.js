import mongoose from 'mongoose';

const SiteAnalyticsSchema = new mongoose.Schema({
  _id: { type: String, default: 'site-stats' },
  totalVisitors: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

SiteAnalyticsSchema.statics.incrementVisitors = async function() {
  return this.findByIdAndUpdate(
    'site-stats',
    { $inc: { totalVisitors: 1 }, $set: { lastUpdated: new Date() } },
    { upsert: true, new: true }
  );
};

SiteAnalyticsSchema.statics.getStats = async function() {
  let stats = await this.findById('site-stats');
  if (!stats) stats = await this.create({ _id: 'site-stats' });
  return stats;
};

export default mongoose.models.SiteAnalytics || mongoose.model('SiteAnalytics', SiteAnalyticsSchema);
