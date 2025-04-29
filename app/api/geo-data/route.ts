import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Отсутствует токен авторизации" },
        { status: 401 }
      );
    }

    const response = await api.get("/geojson/collections/1/export", {
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip",
        Authorization: authHeader,
      },
    });

    const geojson = response.data;

    return NextResponse.json(geojson, { status: 200 });
  } catch (error: unknown) {
    console.error("Ошибка загрузки данных GeoJSON:", error);
    if (error instanceof AxiosError && error.response) {
      return NextResponse.json(
        { error: error.response.data.message || "Ошибка загрузки данных" },
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
