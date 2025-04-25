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

    // Извлечение данных из data
    const {
      token: access_token,
      expires_in,
      refresh_token: new_refresh_token,
      refresh_expires_in,
    } = data;

    const res = NextResponse.json(
      { message: "Токен обновлен", access_token, expires_in },
      { status: 200 }
    );

    // Обновление cookie
    res.cookies.set("refresh_token", new_refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: refresh_expires_in,
      path: "/",
      sameSite: "strict",
    });

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
