// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "Отсутствует токен авторизации" },
      { status: 401 }
    );
  }

  try {
    // Process the multipart form data
    const formData = await request.formData();

    // Forward the form data to the backend API
    const resp = await api.post("/admin/geojson/collections", formData, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(resp.data, {
      status: 201,
    });
  } catch (err: unknown) {
    console.error("Ошибка загрузки GeoJSON файла:", err);
    if (err instanceof AxiosError && err.response) {
      return NextResponse.json(
        { error: err.response.data.message || "Ошибка загрузки GeoJSON файла" },
        { status: err.response.status }
      );
    }
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
