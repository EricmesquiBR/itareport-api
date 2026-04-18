const CENTRO_BBOX = {
  latMin: -3.935,
  latMax: -3.915,
  lngMin: -39.565,
  lngMax: -39.54,
};

export function isInsideBbox(lat: number, lng: number): boolean {
  return (
    lat >= CENTRO_BBOX.latMin &&
    lat <= CENTRO_BBOX.latMax &&
    lng >= CENTRO_BBOX.lngMin &&
    lng <= CENTRO_BBOX.lngMax
  );
}

// ~100m grid cell fuzzing (~0.001 degree ≈ 111m)
const GRID_SIZE = 0.001;

export function fuzzCoords(lat: number, lng: number): { lat: number; lng: number } {
  return {
    lat: Math.round(lat / GRID_SIZE) * GRID_SIZE,
    lng: Math.round(lng / GRID_SIZE) * GRID_SIZE,
  };
}
