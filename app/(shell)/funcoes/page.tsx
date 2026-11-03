import Link from "next/link";
import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow, EmptyState } from "@/components/ui/primitives";
import type { FuncaoPedagogica } from "@/types/database";

type FuncaoLista = FuncaoPedagogica & {
  obra_funcoes: { count: number }[];
  exercicios: { count: number }[];
};

export default async function FuncoesPage() {
  const { supabase } = await requirePerfil();

  const { data } = await supabase
    .from("funcoes_pedagogicas")
    .select("*, obra_funcoes(count), exercicios(count)")
    .order("numero");

  const funcoes = (data ?? []) as unknown as FuncaoLista[];

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>As sete funções</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Funções pedagógicas</h1>
      </div>

      {funcoes.length === 0 ? (
        <EmptyState titulo="Nenhuma função cadastrada" descricao="As funções pedagógicas ainda não foram carregadas no banco." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {funcoes.map((f) => (
            <Link key={f.id} href={`/funcoes/${f.id}`} className="block">
              <Card className="h-full transition hover:border-paideia-gold-400">
                <Eyebrow>Função {f.numero}</Eyebrow>
                <p className="mt-1 font-serif text-lg font-semibold">{f.nome}</p>
                {f.o_que_forma && <p className="mt-1.5 text-sm text-ink/70">{f.o_que_forma}</p>}
                <p className="mt-3 text-xs text-ink/50">
                  {f.obra_funcoes[0]?.count ?? 0} obras • {f.exercicios[0]?.count ?? 0} exercícios
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
