import { NextResponse } from 'next/server';
import { loadDatabase, saveDatabase } from '@/services/db-store';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const db = loadDatabase();
    
    // Check if user exists (Mock authentication logic)
    const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    // Demo fallback logic if user is not in DB but matches demo credentials
    let role = 'student';
    let name = 'طالب ليرنوف المتميز';
    let userId = Date.now().toString();

    if (user) {
      role = user.role_id === 1 ? 'admin' : user.role_id === 2 ? 'instructor' : 'student';
      name = user.name;
      userId = user.id.toString();
    } else {
      // Fallback for demo users
      if (email.includes('admin')) {
        role = 'admin';
        name = 'م. سارة العتيبي (مدير)';
      } else if (email.includes('dr.')) {
        role = 'instructor';
        name = 'د. علي البراك (محاضر)';
      }
    }

    db.auditLogs.unshift({
      id: Date.now(),
      user: name,
      action: 'تسجيل دخول ناجح - Backend',
      resource: `User Login: ${email}`,
      ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
    saveDatabase(db);

    const avatar = role === 'instructor' ? 'د' : role === 'admin' ? 'م' : 'أ';
    const token = await signToken({ userId, role, email, name, avatar });

    const response = NextResponse.json({ success: true, user: { name, email, role, avatar } }, { status: 200 });
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
