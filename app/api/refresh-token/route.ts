import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  const formBody = JSON.stringify({ refresh_token: refreshToken });

  try {
    const response = await api.post("/refresh", formBody.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;

    // Extract only access_token and expires_in since refresh token won't change
    const { token: access_token, expires_in } = data;

    const res = NextResponse.json(
      { message: "Токен обновлен", access_token, expires_in },
      { status: 200 }
    );

    // No need to update the refresh_token cookie as it remains the same
    // Just keep the existing one

    return res;
  } catch (error: unknown) {
    console.error("Ошибка при обновлении токена:", error);
    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(
        { message: error.response.data.message || "Не удалось обновить токен" },
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
