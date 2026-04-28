import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import { getReportById, imageUrl } from "@/api/reports";
import { formatRelative } from "@/lib/relative-time";
import { StatusBadge } from "./status-badge";
import { UpvoteButton } from "./upvote-button";

type ReportDetailProps = { id: string };

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 404
  );
}

export function ReportDetail({ id }: ReportDetailProps) {
  const { data, error, isError } = useQuery({
    queryKey: ["report", id],
    queryFn: () => getReportById(id),
  });

  if (isError && isNotFound(error)) {
    return <p>Reporte não encontrado ou expirado.</p>;
  }

  if (!data) {
    return <div role="status">Carregando…</div>;
  }

  const primary = data.images.find((img) => img.isPrimary) ?? data.images[0];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link to="/map">← Voltar ao mapa</Link>
      <h1>{data.title}</h1>
      <StatusBadge status={data.status} />
      {primary && (
        <img src={imageUrl(primary.storageKey)} alt={data.title} className="rounded my-4" />
      )}
      <p>Credibilidade: {data.credibility}</p>
      <p>Criado {formatRelative(data.createdAt)}</p>
      {data.expiresAt && <p>Expira {formatRelative(data.expiresAt)}</p>}
      <UpvoteButton report={{ id: data.id, upvotes: data.upvotes }} />
      <div className="h-64 my-4">
        <MapContainer center={[data.lat, data.lng]} zoom={16} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[data.lat, data.lng]} />
        </MapContainer>
      </div>
    </div>
  );
}
