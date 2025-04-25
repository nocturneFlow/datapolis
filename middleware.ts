// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Define protected paths, including dynamic segments
  const protectedPaths = ["/admin"];

  const isProtectedRoute = protectedPaths.some((protectedPath) =>
    pathname.startsWith(protectedPath)
  );

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Check for protected routes
  if (isProtectedRoute) {
    if (!refreshToken) {
      // If token is absent, redirect to sign-in page
      const signInUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(signInUrl);
    }
    // Token exists, proceed to the requested page
    return NextResponse.next();
  }

  // Continue the request for all other routes
  return NextResponse.next();
}

// Apply middleware to all routes under the protected paths
export const config = {
  matcher: [
    "/",
    "/applications/:path*",
    "/cashier/:path*",
    "/fines/:path*",
    "/incidents/:path*",
    "/employees/:path*",
    "/expenses/:path*",
    "/cars/:path*",
    "/analytics/:path*",
  ],
};
