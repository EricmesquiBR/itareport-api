import { createFileRoute } from "@tanstack/react-router";

import { ReportDetail } from "@/components/report-detail";

export const Route = createFileRoute("/reports/$id")({
  component: ReportDetailRoute,
});

function ReportDetailRoute() {
  const { id } = Route.useParams();
  return <ReportDetail id={id} />;
}
