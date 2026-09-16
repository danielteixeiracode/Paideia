import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow, ProgressBar } from "@/components/ui/primitives";
import { EtapaRow } from "@/components/trilha/etapa-row";
import type { EtapaTrilha, Eixo, ProgressoTrilha, StatusEtapa } from "@/types/database";

export default async function TrilhaPage() {
  const { supabase, perfil } = await requirePerfil();

  const [{ data: trilhas }, { data: etapas }, { data: eixos }, { data: progresso }] = await Promise.all([
    supabase.from("trilhas").select("*").eq("ativo", true).order("ordem").limit(1),
    supabase.from("etapas_trilha").select("*").eq("ativo", true).order("ordem"),
    supabase.from("eixos").select("*").order("ordem"),
    supabase.from("progresso_trilha").select("*").eq("user_id", perfil.id),
  ]);

  const trilha = trilhas?.[0];
  const listaEtapas = (etapas ?? []) as EtapaTrilha[];
  const listaEixos = (eixos ?? []) as Eixo[];
  const progressoMap = new Map((progresso as ProgressoTrilha[] | null ?? []).map((p) => [p.etapa_id, p]));

  const totalEtapas = listaEtapas.length;
  const concluidas = [...progressoMap.values()].filter((p) => p.status === "concluida").length;
  const progressoGlobal = totalEtapas ? Math.round((concluidas / totalEtapas) * 100) : 0;

  function statusDe(etapa: EtapaTrilha): StatusEtapa {
    return progressoMap.get(etapa.id)?.status ?? "bloqueada";
  }

  function disponivelPara(etapa: EtapaTrilha) {
    if (!etapa.etapa_anterior_id) return true;
    return progressoMap.get(etapa.etapa_anterior_id)?.status === "concluida";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Eyebrow>Curriculum Septem Artium Liberalium</Eyebrow>
          <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">
            {trilha?.nome ?? "Trilha das Sete Artes Liberais"}
          </h1>
          <p className="mt-1 max-w-2xl font-serif italic text-paideia-ink/60">
            {trilha?.descricao}
          </p>
        </div>
        <Card className="w-full shrink-0 lg:w-64">
          <Eyebrow>Progresso Global</Eyebrow>
          <p className="mt-1 font-serif text-2xl font-bold">{progressoGlobal}%</p>
          <ProgressBar value={progressoGlobal} className="mt-2" />
          <p className="mt-1.5 text-xs text-paideia-ink/50">
            {concluidas} de {totalEtapas} etapas concluídas
          </p>
        </Card>
      </div>

      {listaEixos
        .filter((e) => e.slug === "trivium" || e.slug === "quadrivium")
        .map((eixo) => {
          const etapasDoEixo = listaEtapas.filter((e) => e.eixo_id === eixo.id);
          if (etapasDoEixo.length === 0) return null;
          const concluidasEixo = etapasDoEixo.filter((e) => statusDe(e) === "concluida").length;
          return (
            <div key={eixo.id}>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-serif text-lg font-semibold">{eixo.nome}</p>
                <span className="text-xs font-semibold text-paideia-ink/50">
                  {concluidasEixo}/{etapasDoEixo.length} módulos concluídos
                </span>
              </div>
              <div className="space-y-3">
                {etapasDoEixo.map((etapa) => (
                  <EtapaRow
                    key={etapa.id}
                    etapa={etapa}
                    status={statusDe(etapa)}
                    percentual={Number(progressoMap.get(etapa.id)?.percentual ?? 0)}
                    focoAtual={Boolean(progressoMap.get(etapa.id)?.foco_atual)}
                    disponivel={disponivelPara(etapa)}
                  />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}
