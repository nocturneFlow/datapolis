// api/sign-in/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  try {
    // Send JSON data instead of form-urlencoded data
    const response = await api.post(
      "/sign-in",
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    const { token, refresh_token, expires_in, refresh_expires_in } = data;

    // Create the response using NextResponse.json()
    const res = NextResponse.json(
      { message: "Успешный вход", token, expires_in },
      { status: 200 }
    );

    // Set the refresh_token cookie using NextResponse
    res.cookies.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: refresh_expires_in,
      path: "/",
      sameSite: "strict",
    });

    return res;
  } catch (error: unknown) {
    console.error("Ошибка при обращении к бэкенду:", error);
    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(
        { message: error.response.data.message || "Ошибка входа" },
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
