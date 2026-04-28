import "leaflet/dist/leaflet.css";

import { Link } from "@tanstack/react-router";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { getReports, type Report } from "@/api/reports";
import { getCategories, getReportsByCategory, type Category } from "@/api/categories";
import { CENTRO_CENTER } from "@/lib/geofencing";
import { UpvoteButton } from "./upvote-button";

const pin = L.icon({
  iconUrl: "/pinmap.svg",
  iconSize: [20, 20],
  iconAnchor: [17, 20],
  popupAnchor: [17, -48],
});

export default function IssueMap() {
  const [reports, setReports] = useState<Report[] | null>([]);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setError(false);
    (async () => {
      try {
        const result = categoryId
          ? await getReportsByCategory(categoryId)
          : (await getReports({ limit: 100 })).data;
        if (!cancelled) setReports(result);
      } catch {
        if (!cancelled) {
          setReports(null);
          setError(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  const categoriesById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 p-2 bg-slate-100 border-b">
        <label htmlFor="category" className="text-sm font-medium">
          Filtrar:
        </label>
        <select
          id="category"
          className="border text-sm px-2 py-1 rounded focus:outline-none focus:border-gray-600"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <span className="text-xs text-gray-600 ml-auto">
          {reports?.length ?? 0} reportes
        </span>
      </div>
      {error ? (
        <div className="loading">Erro ao carregar reportes. Recarregue a página.</div>
      ) : (
        <MapContainer
          center={CENTRO_CENTER}
          zoom={15}
          scrollWheelZoom
          minZoom={3}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {(reports ?? []).map((report) => (
            <Marker
              key={report.id}
              position={[report.lat, report.lng]}
              icon={pin}
            >
              <Popup>
                <h3>{report.title}</h3>
                <p>
                  {report.categoryId ? categoriesById[report.categoryId] ?? "" : ""}
                </p>
                <p>credibilidade {report.credibility}</p>
                <UpvoteButton report={{ id: report.id, upvotes: report.upvotes }} />
                <p>
                  <Link to="/reports/$id" params={{ id: report.id }}>
                    Ver detalhes →
                  </Link>
                </p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
