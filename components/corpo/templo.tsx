"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ColunaSVG } from "@/components/ui/coluna-progresso";

export interface ColunaTemplo {
  id: string;
  numero: number;
  nome: string;
  preenchimento: number; // 0 a 1, derivado em lib/templo.ts
}

// Geometria do templo (viewBox 700 × 420). A coluna vem de ColunaSVG.
const CENTRO_PRIMEIRA = 98;
const PASSO = 84;

// Templo do Início: cada coluna é uma função pedagógica e se enche de dourado
// de baixo para cima. Quando todas estão cheias, o frontão se acende.
export function Templo({ colunas, aceso }: { colunas: ColunaTemplo[]; aceso: boolean }) {
  const [ativa, setAtiva] = useState<ColunaTemplo | null>(null);

  return (
    <figure className="mx-auto w-full max-w-2xl">
      <svg viewBox="0 0 700 420" className="h-auto w-full" role="group" aria-label="Templo das sete funções pedagógicas">
        {/* Frontão */}
        <polygon
          points="40,122 350,24 660,122"
          className={cn(
            "stroke-[2] transition-[fill] duration-700",
            aceso ? "fill-paideia-gold-400 stroke-paideia-gold-600" : "fill-paideia-cream-200 stroke-paideia-green-800"
          )}
        />
        <polygon
          points="92,112 350,42 608,112"
          className={cn(
            "fill-none stroke-[1.5]",
            aceso ? "stroke-paideia-gold-600" : "stroke-paideia-green-800/40"
          )}
        />

        {/* Arquitrave */}
        <rect x="40" y="122" width="620" height="28" className="fill-paideia-cream-50 stroke-paideia-green-800 stroke-[2]" />

        {/* Colunas */}
        {colunas.map((c, i) => {
          const cx = CENTRO_PRIMEIRA + i * PASSO;
          const destacada = ativa?.id === c.id;
          return (
            <Link
              key={c.id}
              href={`/funcoes/${c.id}`}
              aria-label={`Função ${c.numero}: ${c.nome}`}
              onMouseEnter={() => setAtiva(c)}
              onMouseLeave={() => setAtiva(null)}
              onFocus={() => setAtiva(c)}
              onBlur={() => setAtiva(null)}
            >
              <title>{`${c.numero}. ${c.nome}`}</title>
              <ColunaSVG cx={cx} preenchimento={c.preenchimento} destacada={destacada} animar ordem={i} />
              <text
                x={cx}
                y="406"
                textAnchor="middle"
                className={cn(
                  "font-serif text-[22px] font-bold",
                  destacada ? "fill-gold-ink" : "fill-accent"
                )}
              >
                {c.numero}
              </text>
            </Link>
          );
        })}

        {/* Estilóbato */}
        <rect x="40" y="348" width="620" height="14" className="fill-paideia-cream-50 stroke-paideia-green-800 stroke-[2]" />
        <rect x="24" y="362" width="652" height="14" className="fill-paideia-cream-200 stroke-paideia-green-800 stroke-[2]" />
      </svg>

      <figcaption className="mt-2 min-h-[1.5rem] text-center text-sm text-ink/70" aria-live="polite">
        {ativa ? (
          <>
            <span className="font-semibold text-accent">Função {ativa.numero}</span> · {ativa.nome}
          </>
        ) : (
          "Sete colunas, uma para cada função pedagógica."
        )}
      </figcaption>
    </figure>
  );
}
