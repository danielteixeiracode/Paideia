"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn, romano } from "@/lib/utils";
import { ColunaSVG, DefsOuro, type GeometriaColuna } from "@/components/ui/coluna-progresso";
import { Contador } from "@/components/ui/contador";
import { assinaturaJaVista, marcarAssinaturaVista, registrarAssinatura } from "@/lib/assinatura";

export interface ColunaTemplo {
  id: string;
  numero: number;
  nome: string;
  eventos: number;
  preenchimento: number; // 0 a 1, derivado em lib/templo.ts
}

// Templo-selo (viewBox 240 × 196), desenhado para ser lido pequeno: a 220px
// de largura cada fuste tem 20px e cada romano ~14px; os traços não escalam
// (1,5px de tela). Colunas de 30,67 unidades de passo, de x=28 a x=212.
const PASSO = 184 / 6;
const PRIMEIRA = 28;
const GEOMETRIA: Partial<GeometriaColuna> = {
  topo: 56,
  capitel: 6,
  fuste: 88,
  largura: 22,
  sobraCapitel: 3,
  base: 5,
  sobraBase: 2,
  larguraClique: PASSO,
  estrias: false,
};
const TRACO = { vectorEffect: "non-scaling-stroke" as const };

function eventosPorExtenso(n: number) {
  return n === 1 ? "1 evento" : `${n} eventos`;
}

// Cada coluna é uma função pedagógica e se enche de dourado de baixo para
// cima. Com as sete cheias, o frontão se acende. Mouse e teclado mostram a
// função na legenda; no toque, o primeiro toque mostra e o segundo abre.
export function Templo({
  colunas,
  aceso,
  totalEventos,
  tamanho = "selo",
}: {
  colunas: ColunaTemplo[];
  aceso: boolean;
  totalEventos: number;
  // "selo": no Início, com o momento de assinatura. "grande": em Funções,
  // como navegação, já montado (o momento de assinatura é um só).
  tamanho?: "selo" | "grande";
}) {
  const assinatura = tamanho === "selo";
  const [ativa, setAtiva] = useState<ColunaTemplo | null>(null);
  const ativaRef = useRef<ColunaTemplo | null>(null);
  ativaRef.current = ativa;
  const toque = useRef<{ tipo: string; jaAtiva: boolean }>({ tipo: "", jaAtiva: false });

  // Momento de assinatura: uma vez por sessão. Registra agora; marca o <html>
  // depois que as colunas subiram (ou ao sair do Início), para que a próxima
  // visita nesta aba já encontre o templo pronto.
  useEffect(() => {
    if (!assinatura || assinaturaJaVista()) return;
    registrarAssinatura();
    const montadoEm = Date.now();
    const espera = window.setTimeout(marcarAssinaturaVista, 2500);
    return () => {
      window.clearTimeout(espera);
      // A montagem dupla do React em desenvolvimento desmonta na hora; não conta.
      if (Date.now() - montadoEm > 300) marcarAssinaturaVista();
    };
  }, [assinatura]);

  return (
    <figure className={cn("mx-auto", assinatura ? "w-[240px] lg:mx-0 lg:w-[220px]" : "w-full max-w-[420px]")}>
      <svg viewBox="0 0 240 196" className="h-auto w-full" role="group" aria-label="Templo das sete funções pedagógicas">
        <DefsOuro />
        {/* Frontão */}
        <polygon
          {...TRACO}
          points="12,46 120,8 228,46"
          className={cn(
            "stroke-[1.5] transition-[fill] duration-assinatura",
            aceso ? "fill-paideia-gold-400 stroke-paideia-gold-600" : "fill-paideia-cream-200 stroke-paideia-green-800"
          )}
        />
        {/* Arquitrave */}
        <rect {...TRACO} x="14" y="46" width="212" height="10" className="fill-paideia-cream-50 stroke-paideia-green-800 stroke-[1.5]" />

        {colunas.map((c, i) => {
          const cx = PRIMEIRA + i * PASSO;
          const destacada = ativa?.id === c.id;
          return (
            <Link
              key={c.id}
              href={`/funcoes/${c.id}`}
              aria-label={`Função ${c.numero}: ${c.nome}, ${eventosPorExtenso(c.eventos)}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && setAtiva(c)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setAtiva(null)}
              onPointerDown={(e) => {
                toque.current = { tipo: e.pointerType, jaAtiva: ativaRef.current?.id === c.id };
              }}
              onFocus={() => setAtiva(c)}
              onBlur={() => setAtiva(null)}
              onClick={(e) => {
                // No toque, o primeiro toque só mostra a função na legenda.
                if (toque.current.tipo === "touch" && !toque.current.jaAtiva) {
                  e.preventDefault();
                  setAtiva(c);
                }
                toque.current = { tipo: "", jaAtiva: false };
              }}
            >
              <ColunaSVG cx={cx} preenchimento={c.preenchimento} destacada={destacada} animar={assinatura} ordem={i} geometria={GEOMETRIA} />
              <text
                x={cx}
                y="186"
                textAnchor="middle"
                fontSize={15}
                className={cn("font-serif font-medium", destacada ? "fill-gold-ink" : "fill-accent")}
              >
                {romano(c.numero)}
              </text>
            </Link>
          );
        })}

        {/* Estilóbato */}
        <rect {...TRACO} x="10" y="155" width="220" height="6" className="fill-paideia-cream-50 stroke-paideia-green-800 stroke-[1.5]" />
        <rect {...TRACO} x="4" y="161" width="232" height="6" className="fill-paideia-cream-200 stroke-paideia-green-800 stroke-[1.5]" />
      </svg>

      {/* Legenda de altura fixa: não empurra o layout ao trocar de coluna. */}
      <figcaption className="mt-2 flex h-14 flex-col items-center justify-start text-center" aria-live="polite">
        {ativa ? (
          <>
            <span className="line-clamp-2 text-nota font-semibold text-ink">
              <span className="t-romano mr-1.5 text-gold-ink">{romano(ativa.numero)}</span>
              {ativa.nome}
            </span>
            <span className="t-nota">{eventosPorExtenso(ativa.eventos)}</span>
          </>
        ) : (
          <>
            <span className="text-nota font-semibold text-ink">A formação</span>
            <span className="t-nota">
              {assinatura ? <Contador valor={totalEventos} /> : totalEventos} {totalEventos === 1 ? "evento" : "eventos"}
            </span>
          </>
        )}
      </figcaption>
    </figure>
  );
}
