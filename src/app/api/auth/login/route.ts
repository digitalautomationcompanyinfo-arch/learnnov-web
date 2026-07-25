import { NextResponse } from 'next/server';
import { loadServerDB, saveServerDB } from '@/lib/server-db';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const db = loadServerDB();
    
    // Check if user exists
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    let role = 'student';
    let name = 'طالب ليرنوف المتميز';
    let userId = Date.now().toString();

    if (user) {
      if (user.password && user.password !== password) {
        return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
      }
      role = user.role;
      name = user.name;
      userId = user.id;
    } else {
      // Fallback for demo users only if they match demo passwords
      if (email.includes('admin') && password === 'Password123!') {
        role = 'admin';
        name = 'م. سارة العتيبي (مدير)';
      } else if (email.includes('dr.') && password === 'Password123!') {
        role = 'instructor';
        name = 'د. علي البراك (محاضر)';
      } else if (email.includes('student.demo') && password === 'Password123!') {
        role = 'student';
        name = 'طالب ليرنوف المتميز';
      } else {
        return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
      }
    }

    const avatar = role === 'instructor' ? 'د' : role === 'admin' ? 'م' : 'أ';
    const token = await signToken({ userId, role, email, name, avatar });

    const response = NextResponse.json({ success: true, user: { id: userId, name, email, role, avatar } }, { status: 200 });
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
