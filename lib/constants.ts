// If you're using a public token for development (not recommended for production)
export const MAPBOX_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
  "pk.eyJ1Ijoibm9jdHVybmVmbG93IiwiYSI6ImNtOWNiaXE1bTBoNjkyanF3eHRoZjk1bnoifQ.Xy_0wSIC2ajgtT6mA7LVCA";

// Other constants
export const DEFAULT_CENTER = [37.6173, 55.7558]; // Default map center (Moscow)
export const DEFAULT_ZOOM = 10; // Default zoom level
