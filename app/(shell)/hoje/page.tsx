import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow } from "@/components/ui/primitives";
import { ActivityCard } from "@/components/hoje/activity-card";
import { formatDataLonga, nomeDiaSemana, toISODate } from "@/lib/utils";
import type { AtividadePlanejada } from "@/types/database";

export default async function HojePage() {
  const { supabase, perfil } = await requirePerfil();
  const hoje = toISODate(new Date());

  const { data: atividades } = await supabase
    .from("atividades_planejadas")
    .select("*, eixo:eixos(*)")
    .eq("user_id", perfil.id)
    .or(`data.eq.${hoje},and(data.lt.${hoje},status.neq.concluida)`)
    .order("data", { ascending: true })
    .order("hora_inicio", { ascending: true, nullsFirst: true });

  const lista = (atividades ?? []) as AtividadePlanejada[];
  const atrasadas = lista.filter((a) => a.data < hoje);
  const doDia = lista.filter((a) => a.data === hoje);
  const concluidasHoje = doDia.filter((a) => a.status === "concluida").length;
  const minutosAlocados = doDia.reduce((s, a) => s + a.duracao_min, 0);
  const minutosConcluidos = doDia
    .filter((a) => a.status === "concluida")
    .reduce((s, a) => s + a.duracao_min, 0);

  const hojeDate = new Date();

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-paideia-gold-500">
        <Eyebrow>Liturgia do Pensamento</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold text-paideia-ink">
          Oficina do Dia — {formatDataLonga(hojeDate)}
        </h1>
        <p className="mt-2 max-w-2xl font-serif italic text-paideia-ink/60">
          &ldquo;O tempo é a substância da vida virtuosa. Consagre cada hora ao aperfeiçoamento da
          alma.&rdquo;
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Alocação Temporal" value={`${minutosConcluidos} / ${minutosAlocados || 0} min`} />
          <Stat label="Atividades do Dia" value={`${concluidasHoje} de ${doDia.length}`} />
          <Stat label="Pendência Canônica" value={`${atrasadas.length} em atraso`} destaque={atrasadas.length > 0} />
          <Stat label="Dia" value={nomeDiaSemana(hojeDate)} />
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-serif text-lg font-semibold">Cânone Diário de Atividades</p>
          </div>

          {atrasadas.map((a) => (
            <ActivityCard key={a.id} atividade={a} atrasada />
          ))}
          {doDia.map((a) => (
            <ActivityCard key={a.id} atividade={a} atrasada={false} />
          ))}

          {lista.length === 0 && (
            <Card className="text-center text-sm text-paideia-ink/60">
              Nenhuma atividade planejada para hoje. Organize sua semana em{" "}
              <span className="font-semibold text-paideia-green-800">Planejamento Semanal</span>.
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <Card>
            <Eyebrow>Aforismo da Jornada</Eyebrow>
            <p className="mt-2 font-serif text-sm italic text-paideia-ink/80">
              &ldquo;A sabedoria começa na reflexão sobre os próprios limites.&rdquo;
            </p>
            <p className="mt-2 text-right text-xs font-semibold text-paideia-gold-600">— SÓCRATES</p>
          </Card>

          <Card>
            <Eyebrow>Guia do Mestre</Eyebrow>
            <p className="mt-2 text-sm text-paideia-ink/70">
              Dedique ao menos 10 minutos à leitura em voz alta antes de cada sessão de estudo
              denso. A audição do ritmo é o primeiro passo para a elocução precisa.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, destaque }: { label: string; value: string; destaque?: boolean }) {
  return (
    <div className="rounded-lg bg-paideia-cream-100 p-3">
      <p className="text-[11px] uppercase tracking-wide text-paideia-ink/50">{label}</p>
      <p className={`mt-1 font-serif text-lg font-bold ${destaque ? "text-red-600" : "text-paideia-ink"}`}>
        {value}
      </p>
    </div>
  );
}
