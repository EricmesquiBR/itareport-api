export const CENTRO_BBOX = {
  latMin: -3.935,
  latMax: -3.915,
  lngMin: -39.565,
  lngMax: -39.54,
} as const;

export const CENTRO_CENTER: [number, number] = [
  (CENTRO_BBOX.latMin + CENTRO_BBOX.latMax) / 2,
  (CENTRO_BBOX.lngMin + CENTRO_BBOX.lngMax) / 2,
];

export function isInsideCentro(lat: number, lng: number): boolean {
  return (
    lat >= CENTRO_BBOX.latMin &&
    lat <= CENTRO_BBOX.latMax &&
    lng >= CENTRO_BBOX.lngMin &&
    lng <= CENTRO_BBOX.lngMax
  );
}
