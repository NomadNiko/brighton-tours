import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AdminUser from '@/lib/models/AdminUser';

export async function POST(request) {
  try {
    const { secret } = await request.json();
    
    // Simple secret check to prevent unauthorized admin creation
    if (secret !== process.env.JWT_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const existing = await AdminUser.findOne({ username: process.env.ADMIN_USERNAME });
    if (existing) {
      return NextResponse.json({ message: 'Admin already exists', username: existing.username });
    }

    const admin = await AdminUser.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@brighton-tours.co.uk',
      password: process.env.ADMIN_PASSWORD || 'changeme123',
      role: 'super_admin',
    });

    return NextResponse.json({
      success: true,
      message: 'Admin created',
      username: admin.username,
      email: admin.email,
    });
  } catch (error) {
    console.error('Init admin error:', error);
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}
