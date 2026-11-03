"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { alternarAtivoPublicado } from "@/app/(shell)/admin/actions";

export function PublicarToggle({ id, ativo }: { id: string; ativo: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => alternarAtivoPublicado(id, !ativo))}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-nota font-semibold ${
        ativo ? "bg-action text-on-action" : "bg-muted text-ink-muted"
      }`}
    >
      {pending && <Loader2 className="h-3 w-3 animate-spin" />}
      {ativo ? "Publicado" : "Rascunho"}
    </button>
  );
}
