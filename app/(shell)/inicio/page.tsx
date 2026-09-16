import Link from "next/link";
import { PlayCircle, MessageSquareQuote, Network, Flag, ArrowRight } from "lucide-react";
import { requirePerfil } from "@/lib/data/session";
import { getDashboardData } from "@/lib/data/dashboard";
import { Card, Eyebrow, ProgressBar, Badge } from "@/components/ui/primitives";
import { formatHoras, nomeDiaSemanaCurto, toISODate, addDays, startOfWeek } from "@/lib/utils";

export default async function InicioPage() {
  const { supabase, perfil } = await requirePerfil();
  const { eixos, progressoTrilha, carteira, atividadesHoje, frequencia } = await getDashboardData(
    supabase,
    perfil.id
  );

  const focoAtual = progressoTrilha.find((p) => p.foco_atual) ?? progressoTrilha[0];
  const atividadePrioritaria = atividadesHoje.find((a) => a.prioritaria) ?? atividadesHoje[0];

  const concluidasHoje = atividadesHoje.filter((a) => a.status === "concluida").length;
  const metaDiariaPct =
    atividadesHoje.length > 0 ? Math.round((concluidasHoje / atividadesHoje.length) * 100) : 0;

  function eixoStats(eixoId: string) {
    const rows = progressoTrilha.filter((p) => p.etapa?.eixo_id === eixoId);
    const media = rows.length
      ? Math.round(rows.reduce((s, r) => s + Number(r.percentual), 0) / rows.length)
      : 0;
    return { rows, media };
  }

  const trivium = eixos.find((e) => e.slug === "trivium");
  const quadrivium = eixos.find((e) => e.slug === "quadrivium");

  const ativosPorEixo = new Map<string, number>();
  for (const item of carteira) {
    const eixoId = item.ativo_ref?.eixo_id;
    if (!eixoId) continue;
    ativosPorEixo.set(eixoId, (ativosPorEixo.get(eixoId) ?? 0) + 1);
  }
  const totalAtivos = carteira.length;

  const semanaInicio = startOfWeek(new Date());
  const dias7 = Array.from({ length: 7 }, (_, i) => addDays(semanaInicio, i));
  const frequenciaSet = new Set(frequencia.filter((f) => f.estudou).map((f) => f.data));
  const diasEstudadosUltimos30 = frequencia.filter((f) => f.estudou).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Eyebrow className="mb-2">
            Ano Acadêmico {new Date().getFullYear()} • Período Matutino
          </Eyebrow>
          <h1 className="font-serif text-2xl font-semibold text-paideia-ink sm:text-3xl">
            Salve, {perfil.nome.split(" ")[0]}.{" "}
            <span className="font-serif italic text-paideia-green-700">
              Seu ritmo formativo está em equilíbrio.
            </span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-paideia-ink/60">
            Hoje a mente concentra-se no rigor da forma racional antes de contemplar a harmonia dos
            números celestes.
          </p>
        </div>

        {focoAtual?.etapa && (
          <Card className="w-full shrink-0 lg:w-72">
            <Eyebrow>Estágio do Trivium</Eyebrow>
            <p className="mt-1 font-serif text-lg font-semibold">{focoAtual.etapa.titulo}</p>
            <div className="mt-3 flex items-center gap-2">
              <ProgressBar value={Number(focoAtual.percentual)} className="flex-1" />
              <span className="text-sm font-semibold text-paideia-green-800">
                {Math.round(Number(focoAtual.percentual))}%
              </span>
            </div>
          </Card>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-serif text-lg font-semibold">Trilha das Sete Artes Liberais</p>
              <Eyebrow className="mt-0.5">Grau Atual: Trivium</Eyebrow>
            </div>
            <Link href="/trilha" className="flex items-center gap-1 text-xs font-semibold text-paideia-green-800 hover:underline">
              Plano Integral <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {trivium && (
            <EixoResumo nome="Eixo I: Trivium" media={eixoStats(trivium.id).media} rows={eixoStats(trivium.id).rows} />
          )}
          {quadrivium && (
            <EixoResumo nome="Eixo II: Quadrivium" media={eixoStats(quadrivium.id).media} rows={eixoStats(quadrivium.id).rows} className="mt-5" />
          )}

          <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-paideia-gold-300 bg-paideia-cream-50 p-4">
            <div className="flex items-center gap-2.5">
              <Flag className="h-4 w-4 text-paideia-gold-600" />
              <div>
                <Eyebrow>Próxima Meta de Formatura</Eyebrow>
                <p className="font-serif text-sm font-semibold">Domínio do Silogismo e Falácias Informais</p>
              </div>
            </div>
            <Link href="/trilha" className="btn-secondary shrink-0 px-3 py-1.5 text-xs">
              Continuar
            </Link>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-serif text-lg font-semibold">Carteira Intelectual</p>
              <Eyebrow className="mt-0.5">Patrimônio Formativo Acumulado</Eyebrow>
            </div>
            <span className="rounded-full bg-paideia-cream-200 px-3 py-1 text-xs font-semibold">
              {totalAtivos} Ativos
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[10px] border-paideia-green-800">
              <span className="font-serif text-2xl font-bold">{totalAtivos}</span>
            </div>
            <div className="flex-1 space-y-2">
              {eixos.map((eixo) => {
                const n = ativosPorEixo.get(eixo.id) ?? 0;
                const p = totalAtivos ? Math.round((n / totalAtivos) * 100) : 0;
                return (
                  <div key={eixo.id} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: eixo.cor }} />
                      {eixo.nome}
                    </span>
                    <span className="font-semibold">{p}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <Link href="/carteira" className="btn-secondary mt-5 w-full">
            Ver Carteira Completa <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </div>

      <Card className="border-l-4 border-l-paideia-gold-500">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge tone="gold">Prioridade Máxima</Badge>
          {atividadePrioritaria && (
            <span className="text-xs text-paideia-ink/50">
              {atividadePrioritaria.duracao_min} min estimados
            </span>
          )}
        </div>
        {atividadePrioritaria ? (
          <>
            <p className="font-serif text-xl font-semibold text-paideia-ink">
              {atividadePrioritaria.titulo}
            </p>
            <p className="mt-1.5 text-sm text-paideia-ink/60">
              {atividadePrioritaria.descricao}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/hoje" className="btn-primary">
                <PlayCircle className="h-4 w-4" /> Iniciar Sessão de Estudo
              </Link>
              <Link href="/hoje" className="btn-secondary">
                Ver Ordem do Dia
              </Link>
            </div>
          </>
        ) : (
          <p className="text-sm text-paideia-ink/60">
            Nenhuma atividade agendada para hoje. Visite o Planejamento Semanal para organizar
            sua Ordem do Dia.
          </p>
        )}
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Link href="/mapa" className="block rounded-2xl bg-paideia-green-900 p-6 text-paideia-cream-100 shadow-card transition hover:bg-paideia-green-800">
          <Badge tone="gold" className="mb-3">Cartografia Intelectual</Badge>
          <p className="font-serif text-xl font-semibold">Mapa dos Estudos • Árvore de Conhecimentos</p>
          <p className="mt-2 text-sm text-paideia-cream-100/70">
            Visualize as conexões ontológicas entre dialética, metafísica clássica e o cosmos
            platônico em um grafo interativo.
          </p>
          <span className="btn-secondary mt-5 inline-flex bg-white/10 text-paideia-cream-50 hover:bg-white/20">
            <Network className="h-4 w-4" /> Navegar no Mapa Canônico
          </span>
        </Link>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-serif text-lg font-semibold">Vigília e Constância</p>
            <span className="text-xs text-paideia-ink/50">Últimos 30 dias</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-paideia-cream-100 p-3">
              <p className="font-serif text-xl font-bold">{diasEstudadosUltimos30}</p>
              <p className="text-[11px] text-paideia-ink/50">Dias de vigília</p>
            </div>
            <div className="rounded-lg bg-paideia-cream-100 p-3">
              <p className="font-serif text-xl font-bold">{metaDiariaPct}%</p>
              <p className="text-[11px] text-paideia-ink/50">Meta de hoje</p>
            </div>
            <div className="rounded-lg bg-paideia-cream-100 p-3">
              <p className="font-serif text-xl font-bold">{totalAtivos}</p>
              <p className="text-[11px] text-paideia-ink/50">Ativos na carteira</p>
            </div>
          </div>

          <p className="mt-4 mb-2 text-xs font-semibold text-paideia-ink/60">Frequência dos últimos 7 dias</p>
          <div className="flex gap-1.5">
            {dias7.map((d) => {
              const iso = toISODate(d);
              const estudou = frequenciaSet.has(iso);
              return (
                <div
                  key={iso}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-[10px] font-semibold ${
                    estudou ? "bg-paideia-green-800 text-paideia-gold-300" : "bg-paideia-cream-200 text-paideia-ink/40"
                  }`}
                >
                  {nomeDiaSemanaCurto(d)}
                  <span>{estudou ? "✓" : "–"}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="flex flex-col gap-3 bg-paideia-cream-50/60 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paideia-cream-200 text-paideia-green-800">
            <MessageSquareQuote className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-paideia-ink/80">Sócrates</p>
            <p className="text-xs text-paideia-ink/50">
              Tire uma dúvida no diálogo socrático quando quiser.
            </p>
          </div>
        </div>
        <Link href="/socrates" className="btn-secondary shrink-0 px-3 py-1.5 text-xs">
          Abrir Diálogo <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Card>
    </div>
  );
}

function EixoResumo({
  nome,
  media,
  rows,
  className,
}: {
  nome: string;
  media: number;
  rows: { etapa?: { titulo: string } | null; percentual: number }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold">
        <span>{nome}</span>
        <span className="text-paideia-ink/50">Média: {media}%</span>
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-paideia-ink/40">Nenhuma etapa iniciada neste eixo.</p>
      ) : (
        <div className="space-y-2.5">
          {rows.slice(0, 3).map((r, i) => (
            <div key={i}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="truncate pr-2">{r.etapa?.titulo}</span>
                <span className="font-semibold">{Math.round(Number(r.percentual))}%</span>
              </div>
              <ProgressBar value={Number(r.percentual)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
