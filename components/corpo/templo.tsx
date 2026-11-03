"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ColunaTemplo {
  id: string;
  numero: number;
  nome: string;
  preenchimento: number; // 0 a 1, derivado em lib/templo.ts
}

// Geometria do templo (viewBox 700 × 420).
const CENTRO_PRIMEIRA = 98;
const PASSO = 84;
const FUSTE = { topo: 162, base: 338, meiaLargura: 21 };

// Templo do Início: cada coluna é uma função pedagógica e se enche de dourado
// de baixo para cima. Quando todas estão cheias, o frontão se acende.
export function Templo({ colunas, aceso }: { colunas: ColunaTemplo[]; aceso: boolean }) {
  const [ativa, setAtiva] = useState<ColunaTemplo | null>(null);
  const alturaFuste = FUSTE.base - FUSTE.topo;

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
          const cheio = alturaFuste * c.preenchimento;
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
              <g className="templo-subir" style={{ animationDelay: `${i * 80}ms` }}>
                {/* área de clique da coluna inteira */}
                <rect x={cx - 34} y="150" width="68" height="198" className="fill-transparent" />
                <rect
                  x={cx - FUSTE.meiaLargura}
                  y={FUSTE.topo}
                  width={FUSTE.meiaLargura * 2}
                  height={alturaFuste}
                  className="fill-paideia-cream-100"
                />
                {cheio > 0 && (
                  <rect
                    x={cx - FUSTE.meiaLargura}
                    y={FUSTE.base - cheio}
                    width={FUSTE.meiaLargura * 2}
                    height={cheio}
                    className="fill-paideia-gold-400"
                  />
                )}
                <line x1={cx - 8} y1={FUSTE.topo + 4} x2={cx - 8} y2={FUSTE.base - 4} className="stroke-paideia-green-800/15 stroke-[1.5]" />
                <line x1={cx + 8} y1={FUSTE.topo + 4} x2={cx + 8} y2={FUSTE.base - 4} className="stroke-paideia-green-800/15 stroke-[1.5]" />
                <rect
                  x={cx - FUSTE.meiaLargura}
                  y={FUSTE.topo}
                  width={FUSTE.meiaLargura * 2}
                  height={alturaFuste}
                  className={cn(
                    "fill-none transition-[stroke]",
                    destacada ? "stroke-paideia-gold-600 stroke-[3]" : "stroke-paideia-green-800 stroke-[2]"
                  )}
                />
                {/* capitel e base da coluna */}
                <rect x={cx - 30} y="150" width="60" height="12" className="fill-paideia-cream-50 stroke-paideia-green-800 stroke-[2]" />
                <rect x={cx - 27} y="338" width="54" height="10" className="fill-paideia-cream-50 stroke-paideia-green-800 stroke-[2]" />
              </g>
              <text
                x={cx}
                y="406"
                textAnchor="middle"
                className={cn(
                  "font-serif text-[22px] font-bold",
                  destacada ? "fill-paideia-gold-600" : "fill-paideia-green-800"
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

      <figcaption className="mt-2 min-h-[1.5rem] text-center text-sm text-paideia-ink/70" aria-live="polite">
        {ativa ? (
          <>
            <span className="font-semibold text-paideia-green-800">Função {ativa.numero}</span> · {ativa.nome}
          </>
        ) : (
          "Sete colunas, uma para cada função pedagógica."
        )}
      </figcaption>
    </figure>
  );
}
