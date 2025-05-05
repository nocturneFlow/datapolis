// app/api/geo-data/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";

// In-memory cache
let cachedData: any = null;
let cacheTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "Отсутствует токен авторизации" },
      { status: 401 }
    );
  }

  // Check if we need to use cache
  const useCache = request.headers.get("x-use-cache") !== "false";
  const now = Date.now();

  // Return cached data if available and not expired
  if (useCache && cachedData && now - cacheTime < CACHE_DURATION) {
    return new NextResponse(JSON.stringify(cachedData), {
      status: 200,
      headers: {
        "Content-Type": "application/geo+json; charset=utf-8",
        "Cache-Control": "max-age=600, must-revalidate",
        "X-Cache": "HIT",
        ETag: `"${cachedData.etag || Math.random().toString(36).slice(2, 10)}"`,
      },
    });
  }

  try {
    const resp = await api.get("/geojson/collections/3/export", {
      headers: {
        Authorization: authHeader,
        "Accept-Encoding": "gzip",
      },
    });

    // Чистим и приводим к стандарту RFC 7946
    const raw = resp.data as any;
    const features = (raw.features || []).map((f: any, idx: number) => {
      const { geometry: badGeom, ...props } = f.properties || {};
      return {
        type: "Feature",
        id: f.id ?? `feature-${idx}`,
        properties: props,
        geometry: f.geometry,
      };
    });

    const etag = Math.random().toString(36).slice(2, 10);
    const geojson = {
      type: "FeatureCollection",
      features,
      etag, // Store etag with the data
    };

    // Update cache
    cachedData = geojson;
    cacheTime = now;

    return new NextResponse(JSON.stringify(geojson), {
      status: 200,
      headers: {
        "Content-Type": "application/geo+json; charset=utf-8",
        "Cache-Control": "max-age=600, must-revalidate",
        "X-Cache": "MISS",
        ETag: `"${etag}"`,
      },
    });
  } catch (err: unknown) {
    console.error("Ошибка GeoJSON-прокси:", err);

    // If we have cached data and there's an error, return cached data as fallback
    if (cachedData) {
      return new NextResponse(JSON.stringify(cachedData), {
        status: 200,
        headers: {
          "Content-Type": "application/geo+json; charset=utf-8",
          "Cache-Control": "max-age=60, must-revalidate", // Shorter cache time for error fallback
          "X-Cache": "STALE",
          ETag: `"${
            cachedData.etag || Math.random().toString(36).slice(2, 10)
          }"`,
        },
      });
    }

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
