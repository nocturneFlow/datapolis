// app/api/admin/collections/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "Отсутствует токен авторизации" },
      { status: 401 }
    );
  }

  try {
    const resp = await api.get("/geojson/collections", {
      headers: {
        Authorization: authHeader,
      },
    });

    return NextResponse.json(resp.data, {
      status: 200,
      headers: {
        "Cache-Control": "max-age=300, must-revalidate",
      },
    });
  } catch (err: unknown) {
    console.error("Ошибка получения списка коллекций:", err);
    if (err instanceof AxiosError && err.response) {
      return NextResponse.json(
        { error: err.response.data.message || "Ошибка загрузки данных" },
        { status: err.response.status }
      );
    }
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
