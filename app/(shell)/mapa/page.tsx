import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow, ProgressBar, EmptyState } from "@/components/ui/primitives";
import { CapacidadeToggle } from "@/components/mapa/capacidade-toggle";
import type { CapacidadeEtapa, Eixo, EtapaTrilha, ProgressoCapacidade, ProgressoTrilha } from "@/types/database";

export default async function MapaPage() {
  const { supabase, perfil } = await requirePerfil();

  const [{ data: eixos }, { data: etapas }, { data: progressoTrilha }] = await Promise.all([
    supabase.from("eixos").select("*").order("ordem"),
    supabase.from("etapas_trilha").select("*").eq("ativo", true).order("ordem"),
    supabase.from("progresso_trilha").select("*").eq("user_id", perfil.id),
  ]);

  const listaEixos = (eixos ?? []) as Eixo[];
  const listaEtapas = (etapas ?? []) as EtapaTrilha[];
  const progressoMap = new Map(
    ((progressoTrilha as ProgressoTrilha[] | null) ?? []).map((p) => [p.etapa_id, p])
  );

  const etapaFoco =
    listaEtapas.find((e) => progressoMap.get(e.id)?.foco_atual) ??
    listaEtapas.find((e) => progressoMap.get(e.id)?.status === "em_andamento");

  const { data: capacidadesEtapa } = etapaFoco
    ? await supabase
        .from("capacidades_etapa")
        .select("*")
        .eq("etapa_id", etapaFoco.id)
        .order("ordem")
    : { data: [] as CapacidadeEtapa[] };

  const { data: progressoCapacidades } = await supabase
    .from("progresso_capacidade")
    .select("*")
    .eq("user_id", perfil.id);

  const domMap = new Map(
    ((progressoCapacidades as ProgressoCapacidade[] | null) ?? []).map((p) => [
      p.capacidade_etapa_id,
      p.dominada,
    ])
  );

  const capacidades = (capacidadesEtapa ?? []) as CapacidadeEtapa[];
  const dominadas = capacidades.filter((c) => domMap.get(c.id)).length;

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Ordo Artium Liberalium • Grafo Epistemológico</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">
          Cartografia Intelectual — Árvore e Rede dos Saberes
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-paideia-ink/60">
          Visão panorâmica da articulação viva entre as Sete Artes Liberais e a Filosofia Primeira.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <Eyebrow>Cosmografia dos Estudos</Eyebrow>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {listaEixos.map((eixo) => {
              const etapasDoEixo = listaEtapas.filter((e) => e.eixo_id === eixo.id);
              const media = etapasDoEixo.length
                ? Math.round(
                    etapasDoEixo.reduce((s, e) => s + Number(progressoMap.get(e.id)?.percentual ?? 0), 0) /
                      etapasDoEixo.length
                  )
                : 0;
              return (
                <div
                  key={eixo.id}
                  className="flex flex-col items-center gap-2 rounded-xl border border-paideia-cream-300 bg-paideia-cream-50 p-4 text-center"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: eixo.cor }}
                  >
                    {media}%
                  </div>
                  <p className="text-xs font-semibold">{eixo.nome}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-5 rounded-lg bg-paideia-cream-100 p-3 text-xs text-paideia-ink/60">
            O método de dedução demonstrativa da Lógica é a ferramenta motriz dos Postulados de
            Euclides no Quadrivium — a razão precede o número, e o número confirma a razão.
          </p>
        </Card>

        <Card>
          <div className="mb-1 flex items-center justify-between">
            <Eyebrow>Etapa em Foco</Eyebrow>
            {capacidades.length > 0 && (
              <span className="text-xs font-semibold text-paideia-ink/50">
                {dominadas} de {capacidades.length} dominadas
              </span>
            )}
          </div>

          {etapaFoco ? (
            <>
              <p className="mt-1 font-serif text-lg font-semibold">{etapaFoco.titulo}</p>
              <ProgressBar
                value={capacidades.length ? Math.round((dominadas / capacidades.length) * 100) : 0}
                className="mt-3"
              />

              <div className="mt-4 space-y-2">
                {capacidades.length === 0 ? (
                  <p className="text-sm text-paideia-ink/50">
                    Nenhuma capacidade granular cadastrada para esta etapa.
                  </p>
                ) : (
                  capacidades.map((c) => (
                    <CapacidadeToggle key={c.id} capacidade={c} dominada={Boolean(domMap.get(c.id))} />
                  ))
                )}
              </div>
            </>
          ) : (
            <EmptyState
              titulo="Nenhuma etapa em foco"
              descricao="Escolha uma etapa em Trilha de Formação para acompanhar suas capacidades aqui."
            />
          )}
        </Card>
      </div>
    </div>
  );
}
