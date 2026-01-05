import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import AdminUser from '@/lib/models/AdminUser';

export async function verifyAdmin(request) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
    const admin = await AdminUser.findById(decoded.id);
    if (!admin || !admin.isActive) return null;
    return admin;
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
