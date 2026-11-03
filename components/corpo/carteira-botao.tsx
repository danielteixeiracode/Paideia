"use client";

import { useTransition } from "react";
import { Landmark, Loader2 } from "lucide-react";
import { guardarObra, removerObra } from "@/app/(shell)/obras/actions";
import { Badge } from "@/components/ui/primitives";

// Na ficha da obra: guarda a obra na Carteira ou, se já guardada, mostra o
// estado e permite remover.
export function CarteiraBotao({ obraId, estado }: { obraId: string; estado: string | null }) {
  const [pending, startTransition] = useTransition();

  if (!estado) {
    return (
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => guardarObra(obraId))}
        className="btn-primary px-3 py-1.5 text-xs"
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Landmark className="h-3.5 w-3.5" />}
        Guardar na Carteira
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone="green">Na sua Carteira: {estado}</Badge>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => removerObra(obraId))}
        className="btn-secondary px-3 py-1.5 text-xs"
      >
        {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Remover da Carteira
      </button>
    </div>
  );
}
