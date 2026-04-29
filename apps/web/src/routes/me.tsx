import { createFileRoute } from "@tanstack/react-router";

import { MeAccount } from "@/components/me-account";

export const Route = createFileRoute("/me")({
  component: MeRoute,
});

function MeRoute() {
  return <MeAccount />;
}
