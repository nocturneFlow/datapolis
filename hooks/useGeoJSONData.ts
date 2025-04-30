// useGeoJSONData.ts
import { useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import type mapboxgl from "mapbox-gl";
import type {
  RawEnrichedGridItem,
  EnrichedGridFeatureCollection,
  EnrichedGridProperties,
} from "@/types/geojson";
import type { Feature, MultiPolygon } from "geojson";

const useGeoJSONData = () => {
  const { accessToken } = useAuth();

  /**
   * Normalizes properties to ensure no null values exist
   */
  const normalizeProperties = useCallback(
    (properties: EnrichedGridProperties): EnrichedGridProperties => {
      // Create a copy of the properties object
      const normalized = { ...properties };

      // Replace null values with appropriate defaults (0 for numerical fields)
      // Using proper TypeScript type assertions to avoid index errors
      for (const key in normalized) {
        if (normalized[key as keyof EnrichedGridProperties] === null) {
          (normalized as Record<string, unknown>)[key] = 0;
        }
      }

      return normalized;
    },
    []
  );

  /**
   * Поддерживает оба формата:
   * — массив RawEnrichedGridItem
   * — уже готовый EnrichedGridFeatureCollection
   */
  const fetchGeoJSONData = useCallback<
    () => Promise<EnrichedGridFeatureCollection>
  >(async () => {
    const res = await fetch("/api/geo-data", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`GeoJSON fetch failed: ${res.status}`);
    const raw = (await res.json()) as
      | RawEnrichedGridItem[]
      | EnrichedGridFeatureCollection;

    if (Array.isArray(raw)) {
      const features: Array<Feature<MultiPolygon, EnrichedGridProperties>> =
        raw.map((item) => {
          const { id, properties, geometry } = item;
          const { geometry: _unused, ...cleanProps } = properties;
          // Apply normalization to properties
          const normalizedProps = normalizeProperties(cleanProps);
          return {
            type: "Feature",
            id: id.toString(),
            properties: normalizedProps,
            geometry,
          };
        });

      return {
        type: "FeatureCollection",
        features,
      };
    }

    // For pre-formatted GeoJSON, normalize all feature properties
    const normalizedFeatures = raw.features.map((feature) => ({
      ...feature,
      properties: normalizeProperties(feature.properties),
    }));

    return {
      type: "FeatureCollection",
      features: normalizedFeatures,
    };
  }, [accessToken, normalizeProperties]);

  /**
   * Загружает нормализованные данные на карту
   */
  const loadGeoJSONData = useCallback<
    (map: mapboxgl.Map) => Promise<EnrichedGridFeatureCollection>
  >(
    async (map) => {
      if (!map.isStyleLoaded()) {
        await new Promise<void>((resolve) => {
          const wait = () =>
            map.isStyleLoaded() ? resolve() : setTimeout(wait, 100);
          wait();
        });
      }

      const data = await fetchGeoJSONData();

      if (map.getSource("areas")) {
        map.removeSource("areas");
      }
      map.addSource("areas", { type: "geojson", data });

      return data;
    },
    [fetchGeoJSONData]
  );

  return { fetchGeoJSONData, loadGeoJSONData };
};

export default useGeoJSONData;
