"use client";

import { useTransition } from "react";
import { CheckCircle2, Clock, Loader2, ArrowRightCircle, AlertTriangle } from "lucide-react";
import { concluirAtividade, adiarAtividade } from "@/app/(shell)/hoje/actions";
import { Badge } from "@/components/ui/primitives";
import type { AtividadePlanejada } from "@/types/database";

export function ActivityCard({ atividade, atrasada }: { atividade: AtividadePlanejada; atrasada: boolean }) {
  const [pending, startTransition] = useTransition();
  const concluida = atividade.status === "concluida";

  return (
    <div
      className={`rounded-xl border-l-4 bg-white p-4 shadow-card ${
        atrasada ? "border-l-red-500 bg-red-50/40" : concluida ? "border-l-green-500" : "border-l-paideia-gold-500"
      }`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {atividade.eixo && (
          <Badge tone={atrasada ? "red" : "gold"}>
            {atividade.eixo.nome}
            {atividade.prioritaria ? " • Prioritária" : ""}
          </Badge>
        )}
        {atrasada && (
          <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
            <AlertTriangle className="h-3.5 w-3.5" /> Pendência de {atividade.data}
          </span>
        )}
        <span className="ml-auto flex items-center gap-1 text-xs text-paideia-ink/50">
          <Clock className="h-3.5 w-3.5" /> {atividade.duracao_min} min
        </span>
      </div>

      <p className="font-serif text-base font-semibold text-paideia-ink">{atividade.titulo}</p>
      {atividade.descricao && (
        <p className="mt-1 text-sm text-paideia-ink/60">{atividade.descricao}</p>
      )}

      {!concluida && (
        <div className="mt-3 flex gap-2">
          <button
            disabled={pending}
            onClick={() => startTransition(() => concluirAtividade(atividade.id))}
            className={atrasada ? "btn-primary bg-red-700 hover:bg-red-800" : "btn-primary"}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {atrasada ? "Fazer agora" : "Marcar como Concluída"}
          </button>
          {atrasada && (
            <button
              disabled={pending}
              onClick={() => startTransition(() => adiarAtividade(atividade.id))}
              className="btn-secondary"
            >
              <ArrowRightCircle className="h-4 w-4" /> Mover para Amanhã
            </button>
          )}
        </div>
      )}
      {concluida && (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-green-700">
          <CheckCircle2 className="h-4 w-4" /> Concluída
        </p>
      )}
    </div>
  );
}
