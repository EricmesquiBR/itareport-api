import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { MapContainer, Marker, Rectangle, TileLayer, useMapEvents } from "react-leaflet";

import { useGlobalContext } from "@/context/store";
import { CENTRO_BBOX, CENTRO_CENTER, isInsideCentro } from "@/lib/geofencing";

const pin = L.icon({
  iconUrl: "/pinmap.svg",
  iconSize: [20, 20],
  iconAnchor: [17, 20],
  popupAnchor: [17, -48],
});

const bboxBounds: L.LatLngBoundsLiteral = [
  [CENTRO_BBOX.latMin, CENTRO_BBOX.lngMin],
  [CENTRO_BBOX.latMax, CENTRO_BBOX.lngMax],
];

function MapClickHandler() {
  const { setMarkerData } = useGlobalContext();

  useMapEvents({
    click: (e) => {
      if (isInsideCentro(e.latlng.lat, e.latlng.lng)) {
        setMarkerData([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  return null;
}

export default function ReportFormMap() {
  const { markerData } = useGlobalContext();
  const hasMarker =
    typeof markerData[0] === "number" && typeof markerData[1] === "number";

  return (
    <MapContainer
      center={CENTRO_CENTER}
      zoom={16}
      scrollWheelZoom
      minZoom={14}
      maxBounds={[
        [CENTRO_BBOX.latMin - 0.01, CENTRO_BBOX.lngMin - 0.01],
        [CENTRO_BBOX.latMax + 0.01, CENTRO_BBOX.lngMax + 0.01],
      ]}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Rectangle
        bounds={bboxBounds}
        pathOptions={{ color: "#16a34a", weight: 2, fillOpacity: 0.05 }}
      />
      <MapClickHandler />
      {hasMarker && (
        <Marker
          position={[markerData[0] as number, markerData[1] as number]}
          icon={pin}
        />
      )}
    </MapContainer>
  );
}
