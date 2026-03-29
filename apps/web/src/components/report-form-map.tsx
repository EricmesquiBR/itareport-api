import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import { useGlobalContext } from "@/context/store";

type MapClickEvent = {
  latlng: {
    lat: number;
    lng: number;
  };
};

export default function ReportFormMap() {
  const { markerData, setMarkerData } = useGlobalContext();

  const pin = L.icon({
    iconUrl: "/pinmap.svg",
    iconSize: [20, 20],
    iconAnchor: [17, 20],
    popupAnchor: [17, -48],
  });

  const hasMarker = typeof markerData[0] === "number" && typeof markerData[1] === "number";

  return (
    <MapContainer
      center={[-3.9, -39.5]}
      zoom={10}
      scrollWheelZoom={true}
      minZoom={3}
      ref={(mapInstance) => {
        if (mapInstance) {
          mapInstance.on("click", (e: MapClickEvent) => {
            const { lat, lng } = e.latlng;
            setMarkerData([lat, lng]);
          });
        }
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hasMarker && <Marker position={[markerData[0] as number, markerData[1] as number]} icon={pin} />}
    </MapContainer>
  );
}
