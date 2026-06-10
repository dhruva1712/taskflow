import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export default auth((req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!(req as unknown as { auth: unknown }).auth;

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isProtectedPage = pathname.startsWith('/dashboard');

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (isProtectedPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
