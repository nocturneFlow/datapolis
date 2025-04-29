import {
  FeatureCollection,
  Feature as GeoJsonFeature,
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  GeometryCollection,
} from "geojson";

export interface Properties2 {
  name?: string;
  nameRu?: string;
  area_m2: number;
  grid_id: number;
  area_km2: number;
  population?: number;
  crimes_count: number;
  cameras_count: number;
  company_count: number;
  crimes_per_camera?: number;
  crimes_per_company?: number;
  people_per_company?: number;
  cameras_per_company?: number;
  camera_density_per_km2: number;
  crimes_density_per_km2: number;
  crimes_per_1000_people?: number;
  density_people_per_km2?: number;
  cameras_per_1000_people?: number;
  company_density_per_km2: number;
  companies_per_1000_people?: number;
  // Properties added for risk index calculation and filtering
  riskIndex?: number;
  isHighRisk?: boolean;
}

export interface Crs {
  type: string; // обычно "name" или "EPSG"
  properties: {
    name: string; // например "EPSG:4326"
  };
}

export type MyGeometry =
  | Point // { type: "Point"; coordinates: [number, number] }
  | MultiPoint // { type: "MultiPoint"; coordinates: [ [number, number], ... ] }
  | LineString // { type: "LineString"; coordinates: [ [number, number], ... ] }
  | MultiLineString // { type: "MultiLineString"; coordinates: [ [ [number, number], ... ], ... ] }
  | Polygon // { type: "Polygon"; coordinates: [ [ [number, number], ... ], ... ] }
  | MultiPolygon // { type: "MultiPolygon"; coordinates: [ [ [ [number, number], ... ], ... ], ... ] }
  | GeometryCollection; // если вам нужен GeometryCollection

export type Feature = GeoJsonFeature<MyGeometry, Properties2>;

export interface Root extends FeatureCollection<MyGeometry, Properties2> {
  type: "FeatureCollection"; // уточняем литерал
  name: string; // ваше поле в дополнение к стандартным
  crs: Crs; // добавляем CRS
}
