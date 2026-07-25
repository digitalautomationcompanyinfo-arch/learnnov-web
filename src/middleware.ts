import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PROTECTED_ROUTES = [
  '/admin', '/instructor', '/analytics', '/assignments', '/career', '/certificates',
  '/chat', '/discussions', '/exams', '/labs', '/leaderboard', '/live',
  '/notifications', '/payments', '/profile', '/workspace'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass public routes, API routes (except /api/auth/* if needed), and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/login' ||
    pathname === '/favicon.ico' ||
    pathname === '/logo.png'
  ) {
    return NextResponse.next();
  }

  // Check if trying to access protected UI routes
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route)) || pathname === '/';
  
  if (isProtected) {
    const token = request.cookies.get('learnnov_session')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyToken(token);
    
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role Based Access Control (RBAC)
    const role = payload.role;

    // Instructor area protection
    if (pathname.startsWith('/instructor') && role !== 'instructor' && role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Admin area protection
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
