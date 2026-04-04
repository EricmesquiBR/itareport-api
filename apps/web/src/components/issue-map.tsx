import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { getReports } from "@/api/reports";
import { getCategories, getReportsByCategory } from "@/api/categories";

const pin = L.icon({
  iconUrl: "/pinmap.svg",
  iconSize: [20, 20],
  iconAnchor: [17, 20],
  popupAnchor: [17, -48],
});

type Report = {
  id: string;
  title: string;
  content: string;
  lat?: number;
  lng?: number;
};

export default function IssueMap() {
  const [markersData, setMarkersData] = useState<Report[] | null>([]);
  const [idCat, setIdCat] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const result =
          idCat === ""
            ? await getReports(1000)
            : await getReportsByCategory(idCat);

        setMarkersData(Array.isArray(result) ? result : result.data);
      } catch (error) {
        console.error("Error:", error);
        setMarkersData(null);
      }
    };

    fetchReports();
  }, [idCat]);

  return (
    <>
      <div className="flex">
        <label htmlFor="category" className="px-1">
          Filter:
        </label>
        <select
          id="category"
          className="flex border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
          value={idCat}
          onChange={(e) => setIdCat(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        {!markersData ? (
          <div className="loading flex items-center justify-center z-50">
            Error: Reload the page
          </div>
        ) : (
          <MapContainer center={[-3.9, -39.5]} zoom={10} scrollWheelZoom={true} minZoom={3}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markersData
              .filter((report) => typeof report.lat === "number" && typeof report.lng === "number")
              .map((report) => (
                <Marker
                  key={report.id}
                  position={[report.lat as number, report.lng as number]}
                  icon={pin}
                >
                  <Popup>
                    <h3>{report.title}</h3>
                    <p>{report.content}</p>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        )}
      </div>
    </>
  );
}
