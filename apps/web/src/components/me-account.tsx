import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { deleteMe, getMe } from "@/api/users";
import { signOut, useSession } from "@/lib/auth-client";
import { formatRelative } from "@/lib/relative-time";

export function MeAccount() {
  const session = useSession();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(session.data?.user);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!session.isPending && !isLoggedIn) {
      navigate({ to: "/login" });
    }
  }, [session.isPending, isLoggedIn, navigate]);

  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: isLoggedIn,
  });

  const deletion = useMutation({
    mutationFn: async () => {
      await deleteMe();
      await signOut();
    },
    onSuccess: () => {
      setConfirmOpen(false);
      navigate({ to: "/" });
    },
  });

  if (!isLoggedIn || !data) return null;

  return (
    <div>
      <p>{data.username}</p>
      <p>Conta criada {formatRelative(data.createdAt)}</p>
      <button type="button" onClick={() => setConfirmOpen(true)}>
        Apagar minha conta
      </button>
      {confirmOpen && (
        <div role="dialog" aria-label="Confirmar exclusão de conta">
          <p>Tem certeza? Esta ação é irreversível.</p>
          <button
            type="button"
            onClick={() => setConfirmOpen(false)}
            disabled={deletion.isPending}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => deletion.mutate()}
            disabled={deletion.isPending}
          >
            Confirmar exclusão
          </button>
          {deletion.isError && <p role="alert">Erro ao apagar a conta.</p>}
        </div>
      )}
    </div>
  );
}
