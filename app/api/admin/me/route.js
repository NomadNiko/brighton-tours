import { NextResponse } from 'next/server';
import { verifyAdmin, unauthorized } from '@/lib/auth';

export async function GET(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return unauthorized();

  return NextResponse.json({
    success: true,
    admin: { id: admin._id, username: admin.username, email: admin.email, role: admin.role },
  });
}
