import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import AdminUser from '@/lib/models/AdminUser';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    await connectDB();

    const admin = await AdminUser.findOne({ username }).select('+password');

    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

    const response = NextResponse.json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email, role: admin.role },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
