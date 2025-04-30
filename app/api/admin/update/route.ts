// app/api/admin/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { UpdateFeatureRequest } from "@/types/admin";

export async function PUT(request: NextRequest) {
  // Get feature ID from the URL
  const url = new URL(request.url);
  const idParam = url.searchParams.get("id");

  if (!idParam) {
    return NextResponse.json(
      { error: "Отсутствует ID объекта" },
      { status: 400 }
    );
  }

  const featureId = parseInt(idParam);

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "Отсутствует токен авторизации" },
      { status: 401 }
    );
  }

  try {
    const updateData: UpdateFeatureRequest = await request.json();

    const resp = await api.put(
      `/admin/geojson/features/${featureId}`,
      updateData,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(resp.data, {
      status: 200,
    });
  } catch (err: unknown) {
    console.error("Ошибка обновления объекта:", err);
    if (err instanceof AxiosError && err.response) {
      return NextResponse.json(
        { error: err.response.data.message || "Ошибка обновления объекта" },
        { status: err.response.status }
      );
    }
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
