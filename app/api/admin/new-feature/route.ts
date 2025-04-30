// app/api/admin/new-feature/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { AddFeatureRequest } from "@/types/admin";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "Отсутствует токен авторизации" },
      { status: 401 }
    );
  }

  try {
    // Get collection ID from the URL
    const url = new URL(request.url);
    const collectionId = url.searchParams.get("collectionId");

    if (!collectionId) {
      return NextResponse.json(
        { error: "ID коллекции не указан" },
        { status: 400 }
      );
    }

    const featureData: AddFeatureRequest = await request.json();

    const resp = await api.post(
      `/admin/geojson/collections/${collectionId}/features`,
      featureData,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(resp.data, {
      status: 201,
    });
  } catch (err: unknown) {
    console.error("Ошибка добавления объекта:", err);
    if (err instanceof AxiosError && err.response) {
      return NextResponse.json(
        { error: err.response.data.message || "Ошибка добавления объекта" },
        { status: err.response.status }
      );
    }
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
