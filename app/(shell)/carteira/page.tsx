import Link from "next/link";
import { Landmark, BookOpen } from "lucide-react";
import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow, EmptyState } from "@/components/ui/primitives";
import { CarteiraRow } from "@/components/carteira/carteira-row";
import { formatHoras } from "@/lib/utils";
import type { CarteiraItem } from "@/types/database";

export default async function CarteiraPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const { supabase, perfil } = await requirePerfil();

  const { data } = await supabase
    .from("carteira_itens")
    .select("*, ativo_ref:ativos(*, eixo:eixos(*))")
    .eq("user_id", perfil.id)
    .order("atualizado_em", { ascending: false });

  const itens = (data ?? []) as CarteiraItem[];
  const filtro = searchParams.status;
  const filtrados = filtro ? itens.filter((i) => i.status === filtro) : itens;

  const horasTotais = itens.reduce((s, i) => s + Number(i.horas_investidas), 0);
  const concluidos = itens.filter((i) => i.status === "concluido").length;
  const taxaConclusao = itens.length ? Math.round((concluidos / itens.length) * 100) : 0;

  const contagens = {
    todos: itens.length,
    em_andamento: itens.filter((i) => i.status === "em_andamento").length,
    planejado: itens.filter((i) => i.status === "planejado").length,
    concluido: concluidos,
    pausado: itens.filter((i) => i.status === "pausado").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Patrimônio Filosófico • Ratio Sapientiae {new Date().getFullYear()}</Eyebrow>
          <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Carteira Intelectual</h1>
          <p className="mt-1 max-w-2xl text-sm text-paideia-ink/60">
            Custódia e balanço patrimonial dos saberes herdados da tradição clássica.
          </p>
        </div>
        <Link href="/biblioteca" className="btn-primary shrink-0">
          <BookOpen className="h-4 w-4" /> Aportar Novo Ativo
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-paideia-cream-100">
            <Landmark className="h-5 w-5 text-paideia-green-800" />
          </div>
          <div>
            <p className="font-serif text-2xl font-bold">{itens.length}</p>
            <Eyebrow>Ativos sob custódia</Eyebrow>
          </div>
        </Card>
        <Card>
          <p className="font-serif text-2xl font-bold">{formatHoras(horasTotais)}</p>
          <Eyebrow>Dedicação total estudada</Eyebrow>
        </Card>
        <Card>
          <p className="font-serif text-2xl font-bold">{taxaConclusao}%</p>
          <Eyebrow>Taxa de conclusão</Eyebrow>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <FiltroLink status={undefined} label={`Todos (${contagens.todos})`} atual={filtro} />
        <FiltroLink status="em_andamento" label={`Em Andamento (${contagens.em_andamento})`} atual={filtro} />
        <FiltroLink status="planejado" label={`Planejados (${contagens.planejado})`} atual={filtro} />
        <FiltroLink status="concluido" label={`Concluídos (${contagens.concluido})`} atual={filtro} />
        <FiltroLink status="pausado" label={`Pausados (${contagens.pausado})`} atual={filtro} />
      </div>

      {filtrados.length === 0 ? (
        <EmptyState
          titulo="Nenhum ativo nesta categoria"
          descricao="Explore a Biblioteca Clássica para aportar novos tratados à sua carteira."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-paideia-cream-300 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-paideia-cream-100 text-left text-[11px] uppercase tracking-wide text-paideia-ink/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Ativo Intelectual</th>
                <th className="px-4 py-3 font-semibold">Eixo</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold text-right">Rendimento</th>
                <th className="px-2 py-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paideia-cream-200">
              {filtrados.map((item) => (
                <CarteiraRow key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FiltroLink({
  status,
  label,
  atual,
}: {
  status?: string;
  label: string;
  atual?: string;
}) {
  const active = status === atual || (!status && !atual);
  return (
    <Link
      href={status ? `/carteira?status=${status}` : "/carteira"}
      className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
        active
          ? "bg-paideia-green-800 text-paideia-gold-300"
          : "bg-white text-paideia-ink/70 hover:bg-paideia-cream-100"
      }`}
    >
      {label}
    </Link>
  );
}
