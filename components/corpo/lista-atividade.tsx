import { descreverEvento, type EventoLegivel } from "@/lib/eventos";
import { quandoRelativo, romano } from "@/lib/utils";

export type EventoAtividade = EventoLegivel & {
  id: string;
  criado_em: string;
  funcao: { numero: number; nome: string } | null;
};

// Atividade do aluno em frases humanas, com o romano da função e a data
// relativa, em linhas separadas por filete (Início e ficha da função).
export function ListaAtividade({ eventos, vazio, agora = new Date() }: { eventos: EventoAtividade[]; vazio: string; agora?: Date }) {
  if (eventos.length === 0) return <p className="t-corpo text-ink-muted">{vazio}</p>;
  return (
    <ol className="divide-y-hair divide-rule-strong/40">
      {eventos.map((e) => (
        <li key={e.id} className="flex items-baseline gap-3 py-3">
          <span className="t-romano w-8 shrink-0 text-nota text-gold-ink">
            {e.funcao ? romano(e.funcao.numero) : ""}
            {e.funcao && <span className="sr-only">, função {e.funcao.nome}: </span>}
          </span>
          <span className="min-w-0 flex-1 text-interface text-ink">{descreverEvento(e)}</span>
          <time dateTime={e.criado_em} className="t-nota shrink-0">
            {quandoRelativo(e.criado_em, agora)}
          </time>
        </li>
      ))}
    </ol>
  );
}
