import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import Loading from "@/components/loading";

const IssueMap = lazy(() => import("@/components/issue-map"));

export const Route = createFileRoute("/map")({
  component: MapPage,
});

function MapPage() {
  return (
    <Suspense fallback={<Loading />}>
      <IssueMap />
    </Suspense>
  );
}
