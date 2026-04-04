import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

import { useGlobalContext } from "@/context/store";

const pin = L.icon({
  iconUrl: "/pinmap.svg",
  iconSize: [20, 20],
  iconAnchor: [17, 20],
  popupAnchor: [17, -48],
});

function MapClickHandler() {
  const { setMarkerData } = useGlobalContext();

  useMapEvents({
    click: (e) => {
      setMarkerData([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
}

export default function ReportFormMap() {
  const { markerData } = useGlobalContext();

  const hasMarker = typeof markerData[0] === "number" && typeof markerData[1] === "number";

  return (
    <MapContainer
      center={[-3.9, -39.5]}
      zoom={10}
      scrollWheelZoom={true}
      minZoom={3}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler />
      {hasMarker && <Marker position={[markerData[0] as number, markerData[1] as number]} icon={pin} />}
    </MapContainer>
  );
}
