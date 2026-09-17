"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, Circle, CircleDot, Loader2 } from "lucide-react";
import { Card, ProgressBar } from "@/components/ui/primitives";
import { FASE_ESTILO, FASE_TRANSICAO } from "@/components/mapa/fase-estilo";
import { definirStatusEtapaTrilho } from "@/app/(shell)/mapa/actions";
import { FASES, type FaseTrilho, type StatusEtapaTrilho, type Trilho } from "@/lib/trilhos";
import { cn } from "@/lib/utils";

const STATUS_OPCOES: { id: StatusEtapaTrilho; rotulo: string }[] = [
  { id: "nao_iniciado", rotulo: "Não iniciado" },
  { id: "em_andamento", rotulo: "Em andamento" },
  { id: "concluido", rotulo: "Concluído" },
];

export function TrilhoColuna({
  trilho,
  statusPorEtapa,
}: {
  trilho: Trilho;
  statusPorEtapa: Record<string, StatusEtapaTrilho>;
}) {
  const router = useRouter();
  const [etapaAberta, setEtapaAberta] = useState<string | null>(null);
  const [fasesRecolhidas, setFasesRecolhidas] = useState<FaseTrilho[]>([]);
  const [etapaPendente, setEtapaPendente] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const statusDe = (etapaId: string) => statusPorEtapa[etapaId] ?? "nao_iniciado";
  const concluidas = trilho.etapas.filter((e) => statusDe(e.id) === "concluido").length;
  const fasesPresentes = FASES.filter((f) => trilho.etapas.some((e) => e.fase === f.id));

  function alternarFase(fase: FaseTrilho) {
    setFasesRecolhidas((atual) =>
      atual.includes(fase) ? atual.filter((f) => f !== fase) : [...atual, fase]
    );
  }

  function definirStatus(etapaId: string, status: StatusEtapaTrilho) {
    setEtapaPendente(etapaId);
    startTransition(async () => {
      await definirStatusEtapaTrilho(trilho.id, etapaId, status);
      router.refresh();
      setEtapaPendente(null);
    });
  }

  return (
    <Card className="flex flex-col overflow-hidden p-0">
      <header className="border-b border-paideia-cream-300 bg-paideia-cream-50/60 px-4 py-4 transition duration-200 hover:bg-paideia-cream-100 hover:shadow-[inset_0_-2px_0_0_theme(colors.paideia.gold.400)]">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-paideia-gold-500/60 font-serif text-sm font-bold text-paideia-gold-700">
            {trilho.algarismo}
          </span>
          <div className="min-w-0">
            <p className="font-serif text-lg font-semibold leading-tight text-paideia-ink">
              {trilho.nome}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-paideia-ink/45">
              {trilho.subtitulo}
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-paideia-ink/60">{trilho.descricao}</p>

        <div className="mt-3 flex items-center gap-2.5">
          <ProgressBar
            value={(concluidas / trilho.etapas.length) * 100}
            className="h-1.5 flex-1"
          />
          <span className="shrink-0 text-[11px] font-semibold text-paideia-ink/50">
            {concluidas}/{trilho.etapas.length}
          </span>
        </div>
      </header>

      <div className="flex-1">
        {fasesPresentes.map((fase, indice) => {
          const etapas = trilho.etapas.filter((e) => e.fase === fase.id);
          const estilo = FASE_ESTILO[fase.id];
          const recolhida = fasesRecolhidas.includes(fase.id);
          const anterior = fasesPresentes[indice - 1];
          const puloDaCrise = anterior?.id === "ordem" && fase.id === "restauracao";

          return (
            <section key={fase.id}>
              {anterior && (
                <div className="px-4 py-2.5">
                  <div
                    className={cn(
                      "h-px w-full bg-gradient-to-r",
                      FASE_TRANSICAO[`${anterior.id}-${fase.id}`]
                    )}
                  />
                  {puloDaCrise && (
                    <p className="mt-1.5 text-center text-[10px] uppercase tracking-widest text-paideia-ink/35">
                      não desce à crise
                    </p>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => alternarFase(fase.id)}
                aria-expanded={!recolhida}
                className={cn(
                  "flex w-full items-center gap-2 border-l-[3px] px-4 py-2 text-left transition duration-200",
                  estilo.faixa,
                  estilo.borda
                )}
              >
                <span
                  className={cn("text-[11px] font-bold uppercase tracking-widest", estilo.texto)}
                >
                  {fase.nome}
                </span>
                <span className="text-[11px] font-semibold text-paideia-ink/35">
                  {etapas.length}
                </span>
                <ChevronDown
                  className={cn(
                    "ml-auto h-3.5 w-3.5 transition duration-200",
                    estilo.texto,
                    recolhida && "-rotate-90"
                  )}
                />
              </button>

              {!recolhida && (
                <ol className="relative py-2">
                  <span
                    aria-hidden
                    className={cn("absolute bottom-3 left-5 top-3 w-px", estilo.espinha)}
                  />
                  {etapas.map((etapa) => {
                    const status = statusDe(etapa.id);
                    const aberta = etapaAberta === etapa.id;
                    const pendente = etapaPendente === etapa.id;

                    return (
                      <li key={etapa.id}>
                        <button
                          type="button"
                          onClick={() => setEtapaAberta(aberta ? null : etapa.id)}
                          aria-expanded={aberta}
                          className={cn(
                            "flex w-full items-start gap-2 py-1.5 pl-3 pr-3 text-left",
                            aberta && "bg-paideia-cream-200/60"
                          )}
                        >
                          <span className="relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
                            {pendente ? (
                              <Loader2 className="h-3 w-3 animate-spin text-paideia-ink/40" />
                            ) : status === "concluido" ? (
                              <span className={cn("h-2.5 w-2.5 rounded-full", estilo.ponto)} />
                            ) : status === "em_andamento" ? (
                              <span
                                className={cn(
                                  "h-2.5 w-2.5 rounded-full border-2 bg-paideia-cream-50",
                                  estilo.borda
                                )}
                              />
                            ) : (
                              <span
                                className={cn(
                                  "h-2.5 w-2.5 rounded-full border bg-paideia-cream-50",
                                  estilo.pontoVazio
                                )}
                              />
                            )}
                          </span>

                          <span className="min-w-0 flex-1 text-sm leading-snug">
                            <span className="mr-1 text-[11px] font-semibold text-paideia-ink/35">
                              {etapa.rotulo}.
                            </span>
                            <span
                              className={cn(
                                status === "concluido" ? "text-paideia-ink/55" : "text-paideia-ink",
                                aberta ? "font-semibold" : "font-medium"
                              )}
                            >
                              {etapa.titulo}
                            </span>
                          </span>
                        </button>

                        {aberta && (
                          <div className="mb-2 ml-9 mr-3 rounded-lg border border-paideia-cream-300 bg-paideia-cream-50 p-3">
                            <p className="text-xs leading-relaxed text-paideia-ink/70">
                              {etapa.funcaoPedagogica}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {STATUS_OPCOES.map((opcao) => {
                                const ativo = status === opcao.id;
                                const Icone =
                                  opcao.id === "concluido"
                                    ? CheckCircle2
                                    : opcao.id === "em_andamento"
                                      ? CircleDot
                                      : Circle;
                                return (
                                  <button
                                    key={opcao.id}
                                    type="button"
                                    disabled={pendente}
                                    onClick={() => definirStatus(etapa.id, opcao.id)}
                                    className={cn(
                                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition duration-200 disabled:opacity-50",
                                      ativo
                                        ? estilo.chip
                                        : "bg-white text-paideia-ink/50 hover:bg-paideia-cream-200"
                                    )}
                                  >
                                    <Icone className="h-3 w-3" />
                                    {opcao.rotulo}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          );
        })}
      </div>
    </Card>
  );
}
