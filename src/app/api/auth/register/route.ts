import { NextResponse } from 'next/server';
import { loadServerDB, saveServerDB } from '@/lib/server-db';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = 'student' } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = loadServerDB();
    
    // Check if user already exists
    const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return NextResponse.json({ error: 'البريد الإلكتروني مسجل مسبقاً' }, { status: 409 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send email
    const previewUrl = await sendOtpEmail(email, otp);

    // Save OTP to DB
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins
    
    // Remove old OTPs for this email if any
    db.otps = db.otps.filter(o => o.email.toLowerCase() !== email.toLowerCase());
    
    db.otps.push({
      email,
      otp,
      expiresAt,
      userData: { name, email, role, password }
    });
    
    saveServerDB(db);

    return NextResponse.json({ 
      success: true, 
      message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
      previewUrl // Returned only in development for easy testing
    }, { status: 200 });
    
  } catch (error) {
    console.error('Register OTP Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إرسال البريد الإلكتروني' }, { status: 500 });
  }
}
