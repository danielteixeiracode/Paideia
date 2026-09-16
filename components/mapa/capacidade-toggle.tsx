"use client";

import { useTransition } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { alternarCapacidade } from "@/app/(shell)/mapa/actions";
import type { CapacidadeEtapa } from "@/types/database";

export function CapacidadeToggle({
  capacidade,
  dominada,
}: {
  capacidade: CapacidadeEtapa;
  dominada: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => alternarCapacidade(capacidade.id, !dominada))}
      className="flex w-full items-center gap-3 rounded-lg border border-paideia-cream-300 bg-white px-3 py-2.5 text-left transition hover:border-paideia-gold-400"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-paideia-ink/40" />
      ) : dominada ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-paideia-green-700" />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-paideia-ink/30" />
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-paideia-ink">{capacidade.nome}</p>
        {capacidade.descricao && (
          <p className="truncate text-xs text-paideia-ink/50">{capacidade.descricao}</p>
        )}
      </div>
    </button>
  );
}
