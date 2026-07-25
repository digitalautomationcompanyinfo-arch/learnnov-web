import { NextResponse } from 'next/server';
import { loadDatabase, saveDatabase } from '@/services/db-store';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = 'student' } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = loadDatabase();
    
    // Check if user exists
    const exists = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const roleId = role === 'admin' ? 1 : role === 'instructor' ? 2 : 4;
    const userId = Date.now().toString();

    // Create user (Mock DB storing)
    db.users.push({
      id: parseInt(userId),
      name,
      email,
      role_id: roleId,
      status: 'active',
      mfa_enabled: true,
      created_at: new Date().toISOString()
    });

    db.auditLogs.unshift({
      id: Date.now(),
      user: name,
      action: 'تسجيل حساب جديد - Backend',
      resource: `User Registration: ${email}`,
      ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
    
    saveDatabase(db);

    // Generate JWT
    const avatar = role === 'instructor' ? 'د' : role === 'admin' ? 'م' : 'أ';
    const token = await signToken({ userId, role, email, name, avatar });

    // Set HttpOnly Cookie
    const response = NextResponse.json({ success: true, user: { name, email, role, avatar } }, { status: 201 });
    response.cookies.set({
      name: 'learnnov_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
