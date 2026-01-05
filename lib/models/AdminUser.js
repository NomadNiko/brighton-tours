import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['super_admin', 'admin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
}, { timestamps: true });

AdminUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

AdminUserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
