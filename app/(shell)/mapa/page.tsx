import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow, ProgressBar } from "@/components/ui/primitives";
import { TrilhoColuna } from "@/components/mapa/trilho-coluna";
import { FASE_ESTILO } from "@/components/mapa/fase-estilo";
import { FASES, SINTESE, TOTAL_ETAPAS, TRILHOS, type StatusEtapaTrilho } from "@/lib/trilhos";
import { cn } from "@/lib/utils";
import type { ProgressoTrilhoEtapa } from "@/types/database";

export default async function MapaPage() {
  const { supabase, perfil } = await requirePerfil();

  const { data } = await supabase
    .from("progresso_trilho_etapa")
    .select("*")
    .eq("user_id", perfil.id);

  const statusPorEtapa: Record<string, StatusEtapaTrilho> = {};
  for (const linha of ((data as ProgressoTrilhoEtapa[] | null) ?? [])) {
    statusPorEtapa[linha.etapa_id] = linha.status;
  }

  const concluidas = Object.values(statusPorEtapa).filter((s) => s === "concluido").length;
  const emAndamento = Object.values(statusPorEtapa).filter((s) => s === "em_andamento").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Tres Semitae • Cânone da Formação Clássica</Eyebrow>
          <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">
            Mapa dos Estudos — Os Três Trilhos
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-paideia-ink/60">
            Três percursos paralelos que atravessam o mesmo movimento: uma ordem originária, a crise
            que a rompe, e a restauração do sentido em nível mais alto do que o do ponto de partida.
          </p>
        </div>

        <Card className="w-full shrink-0 lg:w-64">
          <Eyebrow>Travessia</Eyebrow>
          <p className="mt-1 font-serif text-2xl font-bold">
            {concluidas}
            <span className="text-base font-semibold text-paideia-ink/40"> / {TOTAL_ETAPAS}</span>
          </p>
          <ProgressBar value={(concluidas / TOTAL_ETAPAS) * 100} className="mt-2" />
          <p className="mt-2 text-[11px] text-paideia-ink/50">
            etapas concluídas · {emAndamento} em andamento
          </p>
        </Card>
      </div>

      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {FASES.map((fase, indice) => (
          <Fragment key={fase.id}>
            {indice > 0 && (
              <ArrowRight className="hidden h-4 w-4 shrink-0 text-paideia-ink/25 sm:block" />
            )}
            <div className="flex-1">
              <span
                className={cn(
                  "inline-block rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest",
                  FASE_ESTILO[fase.id].chip
                )}
              >
                {fase.nome}
              </span>
              <p className="mt-2 text-xs leading-relaxed text-paideia-ink/60">{fase.resumo}</p>
            </div>
          </Fragment>
        ))}
      </Card>

      <div className="grid items-start gap-5 lg:grid-cols-3">
        {TRILHOS.map((trilho) => (
          <TrilhoColuna key={trilho.id} trilho={trilho} statusPorEtapa={statusPorEtapa} />
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="h-0.5 w-full bg-gradient-to-r from-paideia-fase-ordem-base via-paideia-fase-crise-base to-paideia-fase-restauracao-base opacity-70" />
        <div className="p-5">
          <Eyebrow>Síntese</Eyebrow>
          <p className="mt-1 font-serif text-lg font-semibold text-paideia-ink">{SINTESE.titulo}</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {SINTESE.paragrafos.map((paragrafo) => (
              <p key={paragrafo.slice(0, 32)} className="text-xs leading-relaxed text-paideia-ink/55">
                {paragrafo}
              </p>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
