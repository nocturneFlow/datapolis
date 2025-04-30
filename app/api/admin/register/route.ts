// app/api/admin/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { registerUser } from "@/types/admin";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "Отсутствует токен авторизации" },
      { status: 401 }
    );
  }

  try {
    const userData: registerUser = await request.json();

    const resp = await api.post("/admin/register", userData, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(resp.data, {
      status: 201,
    });
  } catch (err: unknown) {
    console.error("Ошибка регистрации пользователя:", err);
    if (err instanceof AxiosError && err.response) {
      return NextResponse.json(
        {
          error: err.response.data.message || "Ошибка регистрации пользователя",
        },
        { status: err.response.status }
      );
    }
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
