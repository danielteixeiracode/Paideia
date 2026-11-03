"use client";

import { useMemo, useState } from "react";
import { ExercicioItem } from "@/components/corpo/exercicio-item";
import { cn } from "@/lib/utils";
import type { Exercicio } from "@/types/database";

export type ExercicioDaFuncao = Omit<Exercicio, "obra" | "funcao"> & { obra: { id: string; titulo: string } | null };

// Exercícios da função com um filtro simples: todos, só os gerais, ou os
// escritos para uma obra. O filtro só aparece quando há o que separar.
export function ExerciciosDaFuncao({ exercicios }: { exercicios: ExercicioDaFuncao[] }) {
  const [filtro, setFiltro] = useState<string>("todos");

  const obras = useMemo(() => {
    const mapa = new Map<string, string>();
    for (const e of exercicios) if (e.obra) mapa.set(e.obra.id, e.obra.titulo);
    return Array.from(mapa, ([id, titulo]) => ({ id, titulo }));
  }, [exercicios]);
  const temGerais = exercicios.some((e) => !e.obra);

  const visiveis = exercicios.filter((e) =>
    filtro === "todos" ? true : filtro === "gerais" ? !e.obra : e.obra?.id === filtro
  );

  if (exercicios.length === 0) {
    return <p className="t-corpo text-ink-muted">Ainda não há exercícios desta função.</p>;
  }

  const opcoes = [
    { id: "todos", rotulo: "Todos" },
    ...(temGerais && obras.length > 0 ? [{ id: "gerais", rotulo: "Gerais da função" }] : []),
    ...(obras.length > 0 && (temGerais || obras.length > 1) ? obras.map((o) => ({ id: o.id, rotulo: o.titulo })) : []),
  ];

  return (
    <div className="space-y-3">
      {opcoes.length > 1 && (
        <div role="group" aria-label="Filtrar exercícios" className="flex flex-wrap gap-1.5">
          {opcoes.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={filtro === o.id}
              onClick={() => setFiltro(o.id)}
              className={cn(
                "min-h-8 rounded-full border px-3 py-1 text-nota transition-colors duration-discreto ease-discreto [@media(pointer:coarse)]:min-h-11",
                filtro === o.id ? "border-action bg-action font-semibold text-on-action" : "border-rule bg-surface text-ink hover:border-ink-muted"
              )}
            >
              {o.rotulo}
            </button>
          ))}
        </div>
      )}
      <p className="t-nota" aria-live="polite">
        {visiveis.length === 1 ? "1 exercício" : `${visiveis.length} exercícios`}
      </p>
      <ul className="divide-y-hair divide-rule-strong/40">
        {visiveis.map((e) => (
          <ExercicioItem key={e.id} exercicio={e} obra={e.obra} especifico={Boolean(e.obra)} />
        ))}
      </ul>
    </div>
  );
}
