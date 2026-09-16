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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        ativo ? "bg-paideia-green-800 text-paideia-gold-300" : "bg-paideia-cream-200 text-paideia-ink/50"
      }`}
    >
      {pending && <Loader2 className="h-3 w-3 animate-spin" />}
      {ativo ? "Publicado" : "Rascunho"}
    </button>
  );
}
