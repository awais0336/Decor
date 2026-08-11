import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  // Only protect /admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Skip protection for the login page itself
    if (req.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = req.cookies.get('admin_token');
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
