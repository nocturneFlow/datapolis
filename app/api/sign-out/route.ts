import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

type LogoutResponse = {
  message: string;
  status: "success" | "error";
};

export async function POST(request: NextRequest) {
  try {
    // Add CSRF protection
    const csrfToken = request.headers.get("X-CSRF-Token");
    if (!csrfToken || csrfToken !== (await cookies()).get("csrf")?.value) {
      return NextResponse.json<LogoutResponse>(
        { message: "Invalid CSRF token", status: "error" },
        { status: 403 }
      );
    }

    // Check if user has active session
    const hasRefreshToken = request.cookies.has("refresh_token");
    const hasAccessToken = request.cookies.has("access_token");

    if (!hasRefreshToken && !hasAccessToken) {
      return NextResponse.json<LogoutResponse>(
        {
          message: "Пользователь уже вышел из системы",
          status: "success",
        },
        { status: 200 }
      );
    }

    // Add security headers
    const response = NextResponse.json<LogoutResponse>(
      {
        message: "Успешный выход",
        status: "success",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        },
      }
    );

    // Clear all auth tokens
    response.cookies.set("refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
      sameSite: "strict",
    });

    response.cookies.set("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error: unknown) {
    // Log the error for debugging
    console.error("Logout error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Произошла ошибка при выходе";

    return NextResponse.json<LogoutResponse>(
      {
        message: errorMessage,
        status: "error",
      },
      { status: 500 }
    );
  }
}
