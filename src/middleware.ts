import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/login');
  const isProtectedRoute = pathname.startsWith('/dashboard') ||
                           pathname.startsWith('/products') ||
                           pathname.startsWith('/transactions') ||
                           pathname.startsWith('/staff');

  // No token and trying to access protected route -> redirect to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Has token and trying to access login -> redirect to dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Staff route owner-only check: decode JWT to get role (simple base64 decode)
  if (token && pathname.startsWith('/staff')) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'owner') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/products/:path*',
    '/transactions/:path*',
    '/staff/:path*',
    '/login',
  ],
};
