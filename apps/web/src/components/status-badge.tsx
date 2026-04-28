import type { ReportStatus } from "@/api/reports";

const LABELS: Record<ReportStatus, string> = {
  pending: "Em validação",
  active: "Confirmado",
  expired: "Expirado",
};

const CLASSES: Record<ReportStatus, string> = {
  pending: "bg-gray-200 text-gray-800",
  active: "bg-green-200 text-green-900",
  expired: "bg-zinc-300 text-zinc-700",
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${CLASSES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
