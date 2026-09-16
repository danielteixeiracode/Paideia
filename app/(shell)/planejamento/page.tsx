import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow } from "@/components/ui/primitives";
import { NovaAtividadeForm } from "@/components/planejamento/nova-atividade-form";
import { AtividadeChip } from "@/components/planejamento/atividade-chip";
import { addDays, formatMinutos, nomeDiaSemana, startOfWeek, toISODate } from "@/lib/utils";
import type { AtividadePlanejada, Eixo } from "@/types/database";

export default async function PlanejamentoPage() {
  const { supabase, perfil } = await requirePerfil();

  const semanaInicio = startOfWeek(new Date());
  const semanaFim = addDays(semanaInicio, 6);
  const dias = Array.from({ length: 7 }, (_, i) => addDays(semanaInicio, i));
  const hoje = toISODate(new Date());

  const [{ data: atividades }, { data: eixos }] = await Promise.all([
    supabase
      .from("atividades_planejadas")
      .select("*, eixo:eixos(*)")
      .eq("user_id", perfil.id)
      .gte("data", toISODate(semanaInicio))
      .lte("data", toISODate(semanaFim))
      .order("hora_inicio", { ascending: true, nullsFirst: true }),
    supabase.from("eixos").select("*").order("ordem"),
  ]);

  const lista = (atividades ?? []) as AtividadePlanejada[];
  const listaEixos = (eixos ?? []) as Eixo[];

  const minutosAlocados = lista.reduce((s, a) => s + a.duracao_min, 0);
  const metaMin = perfil.meta_semanal_horas * 60;

  const porDia = new Map<string, AtividadePlanejada[]>();
  for (const d of dias) porDia.set(toISODate(d), []);
  for (const a of lista) {
    if (porDia.has(a.data)) porDia.get(a.data)!.push(a);
  }

  const minutosPorEixo = new Map<string, number>();
  for (const a of lista) {
    if (!a.eixo_id) continue;
    minutosPorEixo.set(a.eixo_id, (minutosPorEixo.get(a.eixo_id) ?? 0) + a.duracao_min);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Eyebrow>Ordo Temporis • Trivium &amp; Quadrivium</Eyebrow>
          <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Planejamento Semanal</h1>
          <p className="mt-1 text-sm text-paideia-ink/60">
            Semana de {toISODate(semanaInicio)} a {toISODate(semanaFim)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Meta Semanal" value={formatMinutos(metaMin)} />
          <Stat label="Alocado" value={formatMinutos(minutosAlocados)} />
          <Stat label="Saldo Livre" value={formatMinutos(Math.max(0, metaMin - minutosAlocados))} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {dias.map((d) => {
          const iso = toISODate(d);
          const atividadesDoDia = porDia.get(iso) ?? [];
          const isHoje = iso === hoje;
          return (
            <div
              key={iso}
              className={`flex flex-col rounded-xl border p-3 ${
                isHoje ? "border-paideia-gold-500 bg-paideia-cream-50" : "border-paideia-cream-300 bg-white"
              }`}
            >
              <div className="mb-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-paideia-ink/50">
                  {nomeDiaSemana(d)}
                </p>
                <p className="font-serif text-sm font-semibold">
                  {d.getDate()} {isHoje && <span className="text-paideia-gold-600">• hoje</span>}
                </p>
              </div>

              <div className="flex-1 space-y-2">
                {atividadesDoDia.map((a) => (
                  <AtividadeChip key={a.id} atividade={a} />
                ))}
              </div>

              <div className="mt-2">
                <NovaAtividadeForm dataPadrao={iso} eixos={listaEixos} />
              </div>
            </div>
          );
        })}
      </div>

      <Card>
        <Eyebrow>Equilíbrio da Semana</Eyebrow>
        <p className="mt-1 font-serif text-lg font-semibold">Distribuição por Eixo</p>
        <div className="mt-4 space-y-3">
          {listaEixos.map((eixo) => {
            const min = minutosPorEixo.get(eixo.id) ?? 0;
            const pct = minutosAlocados ? Math.round((min / minutosAlocados) * 100) : 0;
            return (
              <div key={eixo.id} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-xs font-semibold">{eixo.nome}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-paideia-cream-200">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: eixo.cor }}
                  />
                </div>
                <span className="w-20 shrink-0 text-right text-xs text-paideia-ink/50">
                  {formatMinutos(min)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-paideia-cream-300 bg-white px-4 py-2.5 text-center shadow-card">
      <p className="text-[10px] uppercase tracking-wide text-paideia-ink/50">{label}</p>
      <p className="font-serif text-base font-bold">{value}</p>
    </div>
  );
}
