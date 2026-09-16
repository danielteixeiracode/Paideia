"use client";

import { useTransition } from "react";
import { CheckCircle2, Lock, Loader2, PlayCircle } from "lucide-react";
import { definirFoco } from "@/app/(shell)/trilha/actions";
import { ProgressBar, Badge } from "@/components/ui/primitives";
import { formatHoras } from "@/lib/utils";
import type { EtapaTrilha, StatusEtapa } from "@/types/database";

export function EtapaRow({
  etapa,
  status,
  percentual,
  focoAtual,
  disponivel,
}: {
  etapa: EtapaTrilha;
  status: StatusEtapa;
  percentual: number;
  focoAtual: boolean;
  disponivel: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const concluida = status === "concluida";
  const bloqueada = !disponivel && status === "bloqueada";

  return (
    <div
      className={`rounded-xl border p-4 ${
        focoAtual
          ? "border-paideia-gold-500 bg-paideia-cream-50 shadow-card"
          : bloqueada
          ? "border-paideia-cream-200 bg-paideia-cream-100/50 opacity-60"
          : "border-paideia-cream-300 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-paideia-ink/50">
            <span>{etapa.codigo}</span>
            {concluida && <Badge tone="green"><CheckCircle2 className="h-3 w-3" /> Concluída</Badge>}
            {focoAtual && <Badge tone="gold">Foco Atual</Badge>}
            {bloqueada && <Badge tone="neutral"><Lock className="h-3 w-3" /> Bloqueada</Badge>}
          </div>
          <p className="font-serif text-base font-semibold text-paideia-ink">{etapa.titulo}</p>
          {etapa.descricao && <p className="mt-1 text-sm text-paideia-ink/60">{etapa.descricao}</p>}

          <div className="mt-3 flex items-center gap-3">
            <ProgressBar value={percentual} className="max-w-xs flex-1" />
            <span className="shrink-0 text-xs font-semibold text-paideia-ink/60">
              {Math.round(percentual)}% • {formatHoras(etapa.carga_horas_estimada)}
            </span>
          </div>
        </div>

        {!bloqueada && !concluida && (
          <button
            disabled={pending}
            onClick={() => startTransition(() => definirFoco(etapa.id))}
            className="btn-primary shrink-0 px-3 py-2 text-xs"
          >
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlayCircle className="h-3.5 w-3.5" />}
            {focoAtual ? "Continuar" : "Estudar"}
          </button>
        )}
      </div>
    </div>
  );
}
