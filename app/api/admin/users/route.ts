// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { userList } from "@/types/admin";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "Отсутствует токен авторизации" },
      { status: 401 }
    );
  }

  try {
    const resp = await api.get("/admin/users", {
      headers: {
        Authorization: authHeader,
      },
    });

    const users: userList[] = resp.data;

    return NextResponse.json(users, {
      status: 200,
      headers: {
        "Cache-Control": "max-age=60, must-revalidate",
      },
    });
  } catch (err: unknown) {
    console.error("Ошибка получения списка пользователей:", err);
    if (err instanceof AxiosError && err.response) {
      return NextResponse.json(
        {
          error:
            err.response.data.message ||
            "Ошибка получения списка пользователей",
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
