import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { voteOnReport } from "@/api/reports";
import { useSession } from "@/lib/auth-client";

type UpvoteButtonProps = {
  report: { id: string; upvotes: number };
};

function isConflict(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 409
  );
}

export function UpvoteButton({ report }: UpvoteButtonProps) {
  const session = useSession();
  const isLoggedIn = Boolean(session.data?.user);
  const [count, setCount] = useState(report.upvotes);

  const mutation = useMutation({
    mutationFn: () => voteOnReport(report.id),
    onMutate: () => {
      setCount((prev) => prev + 1);
    },
    onError: (error) => {
      if (!isConflict(error)) {
        setCount((prev) => Math.max(0, prev - 1));
      }
    },
  });

  const voted = mutation.isSuccess || (mutation.isError && isConflict(mutation.error));
  const showError = mutation.isError && !isConflict(mutation.error);

  if (voted) {
    return (
      <button type="button" disabled>
        Confirmado <span>{count}</span>
      </button>
    );
  }

  return (
    <span>
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={!isLoggedIn || mutation.isPending}
        title={isLoggedIn ? undefined : "Faça login para confirmar"}
      >
        Confirmar <span>{count}</span>
      </button>
      {showError && <span role="alert"> Erro ao confirmar</span>}
    </span>
  );
}
