"use client";

import { useTransition } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { removerAtividade } from "@/app/(shell)/planejamento/actions";
import type { AtividadePlanejada } from "@/types/database";

export function AtividadeChip({ atividade }: { atividade: AtividadePlanejada }) {
  const [pending, startTransition] = useTransition();
  const concluida = atividade.status === "concluida";

  return (
    <div
      className={`group relative rounded-lg border p-2.5 text-xs ${
        concluida ? "border-green-200 bg-green-50" : "border-paideia-cream-300 bg-white"
      }`}
    >
      {atividade.eixo && (
        <p className="mb-1 truncate text-[10px] font-semibold uppercase tracking-wide text-paideia-gold-600">
          {atividade.eixo.nome}
        </p>
      )}
      <p className="truncate font-medium text-paideia-ink">{atividade.titulo}</p>
      <div className="mt-1 flex items-center justify-between text-[10px] text-paideia-ink/50">
        <span>{atividade.duracao_min}min</span>
        {concluida && <CheckCircle2 className="h-3 w-3 text-green-600" />}
      </div>
      <button
        disabled={pending}
        onClick={() => startTransition(() => removerAtividade(atividade.id))}
        className="absolute right-1 top-1 rounded p-0.5 text-paideia-ink/30 opacity-0 hover:bg-paideia-cream-100 hover:text-red-600 group-hover:opacity-100"
      >
        {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
      </button>
    </div>
  );
}
