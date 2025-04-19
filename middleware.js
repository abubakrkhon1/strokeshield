import { NextResponse } from 'next/server';

// Define which paths require authentication
const protectedPaths = [
  '/face-scan',
  '/profile',
  '/voice-scan',
  '/results',
];

export function middleware(request) {
  // Get the path from the request URL
  const path = request.nextUrl.pathname;
  
  // Check if this path should be protected
  const isProtectedPath = protectedPaths.some(pp => 
    path === pp || path.startsWith(`${pp}/`)
  );
  
  // If this is not a protected path, let the request proceed
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  
  // If there's no token and this is a protected route, redirect to login
  if (!token && isProtectedPath) {
    // Create the redirect URL, preserving the original URL as a "from" parameter
    const from = encodeURIComponent(request.nextUrl.pathname);
    const redirectUrl = new URL(`/login?from=${from}`, request.url);
    
    return NextResponse.redirect(redirectUrl);
  }
  
  // Otherwise, let the request proceed
  return NextResponse.next();
}

// Configure paths that should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api routes
     * - /_next (Next.js internals)
     * - /fonts, /images (static files)
     * - /login, /register (auth pages)
     * - /favicon.ico, /robots.txt (SEO files)
     */
    '/((?!api|_next|fonts|images|login|register|favicon.ico|robots.txt).*)',
  ],
};