import { FeatureProperties, MultiPolygonGeometry } from "@/types/admin";
import {
  EnrichedGridFeature,
  EnrichedGridFeatureCollection,
} from "@/types/geojson";
import { handleApiError } from "@/utils/api-errors";

export class FeaturesService {
  /**
   * Fetch features for a specific collection
   */
  static async getFeaturesByCollection(
    collectionId: number,
    accessToken: string
  ): Promise<EnrichedGridFeature[]> {
    try {
      if (!accessToken) {
        throw new Error("Not authenticated");
      }

      // Note: This should be adjusted to use a proper endpoint for fetching features
      // from a specific collection, or add filtering parameters
      const response = await fetch(`/api/geo-data?collection=${collectionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch features");
      }

      const data: EnrichedGridFeatureCollection = await response.json();
      return data.features || [];
    } catch (error) {
      throw handleApiError(error, "Failed to load features");
    }
  }

  /**
   * Add a new feature to a collection
   */
  static async addFeature(
    collectionId: number,
    data: {
      properties: Partial<FeatureProperties>;
      geometry: MultiPolygonGeometry | null;
    },
    accessToken: string
  ): Promise<any> {
    try {
      if (!accessToken) {
        throw new Error("Not authenticated");
      }

      if (!data.geometry) {
        throw new Error("Geometry is required");
      }

      const response = await fetch(
        `/api/admin/new-feature?collectionId=${collectionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            properties: data.properties,
            geometry: data.geometry,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add feature");
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error, "Failed to add feature");
    }
  }

  /**
   * Update an existing feature
   */
  static async updateFeature(
    featureId: number | string,
    data: {
      properties?: Partial<FeatureProperties>;
      geometry?: MultiPolygonGeometry | null;
    },
    accessToken: string
  ): Promise<any> {
    try {
      if (!accessToken) {
        throw new Error("Not authenticated");
      }

      const updateData: any = {};

      if (data.properties && Object.keys(data.properties).length > 0) {
        updateData.properties = data.properties;
      }

      if (data.geometry) {
        updateData.geometry = data.geometry;
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error("No data provided for update");
      }

      const response = await fetch(`/api/admin/update?id=${featureId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update feature");
      }

      return await response.json();
    } catch (error) {
      throw handleApiError(error, "Failed to update feature");
    }
  }
}
