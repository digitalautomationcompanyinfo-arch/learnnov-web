import { NextResponse } from 'next/server';
import { loadServerDB, saveServerDB } from '@/lib/server-db';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Missing email or OTP' }, { status: 400 });
    }

    const db = loadServerDB();
    
    // Find valid OTP
    const otpIndex = db.otps.findIndex(o => o.email.toLowerCase() === email.toLowerCase() && o.otp === otp);
    
    if (otpIndex === -1) {
      return NextResponse.json({ error: 'رمز التحقق غير صحيح' }, { status: 400 });
    }

    const record = db.otps[otpIndex];
    
    if (Date.now() > record.expiresAt) {
      db.otps.splice(otpIndex, 1);
      saveServerDB(db);
      return NextResponse.json({ error: 'انتهت صلاحية رمز التحقق' }, { status: 400 });
    }

    // OTP is valid. Create the user
    const userId = Date.now().toString();
    const newUser = {
      id: userId,
      name: record.userData.name,
      email: record.userData.email,
      role: record.userData.role,
      password: record.userData.password, // Save password for future login
      status: 'active'
    };

    db.users.push(newUser);
    // Remove the used OTP
    db.otps.splice(otpIndex, 1);
    saveServerDB(db);

    // Generate JWT
    const avatar = newUser.role === 'instructor' ? 'د' : newUser.role === 'admin' ? 'م' : 'أ';
    const token = await signToken({ userId, role: newUser.role, email: newUser.email, name: newUser.name, avatar });

    // Set HttpOnly Cookie
    const response = NextResponse.json({ success: true, user: { name: newUser.name, email: newUser.email, role: newUser.role, avatar } }, { status: 201 });
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
