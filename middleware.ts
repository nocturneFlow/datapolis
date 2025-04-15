import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which paths require authentication
const protectedPaths = ["/renovation", "/admin", "/admin/register", "/profile"];

// Define paths that should be accessible only to non-authenticated users
const authPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for authentication tokens
  const accessToken = request.cookies.get("access-token")?.value;
  const refreshToken = request.cookies.get("refresh-token")?.value;

  // Protect routes that require authentication
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!accessToken && !refreshToken) {
      // Store the current path in a searchParam for redirection after login
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Prevent authenticated users from accessing login/register pages
  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (accessToken || refreshToken) {
      return NextResponse.redirect(new URL("/renovation", request.url));
    }
  }

  return NextResponse.next();
}

// Configure middleware to run only on specific paths
export const config = {
  matcher: [...protectedPaths, ...authPaths],
};
