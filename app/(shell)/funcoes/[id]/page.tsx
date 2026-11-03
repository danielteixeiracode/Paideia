import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow, EmptyState } from "@/components/ui/primitives";
import { ExercicioItem } from "@/components/corpo/exercicio-item";
import { ContextoTela } from "@/components/socrates/contexto-tela";
import type { Exercicio, FuncaoPedagogica, Obra } from "@/types/database";

export default async function FuncaoPage({ params }: { params: { id: string } }) {
  const { supabase } = await requirePerfil();

  const { data } = await supabase
    .from("funcoes_pedagogicas")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();
  if (!data) notFound();
  const funcao = data as FuncaoPedagogica;

  const [{ data: ligacoes }, { data: exerciciosData }] = await Promise.all([
    supabase
      .from("obra_funcoes")
      .select("nota, obra:obras(*)")
      .eq("funcao_id", funcao.id),
    supabase
      .from("exercicios")
      .select("*, obra:obras(id, titulo, ativo)")
      .eq("funcao_id", funcao.id)
      .eq("ativo", true)
      .order("ordem"),
  ]);

  const obras = ((ligacoes ?? []) as unknown as { nota: string | null; obra: Obra | null }[])
    .filter((l) => l.obra?.ativo)
    .sort((a, b) => a.obra!.ordem - b.obra!.ordem || a.obra!.titulo.localeCompare(b.obra!.titulo));

  const exercicios = (exerciciosData ?? []) as unknown as (Exercicio & {
    obra: { id: string; titulo: string; ativo: boolean } | null;
  })[];

  return (
    <div className="space-y-6">
      <ContextoTela tipo="funcao" id={funcao.id} />
      <div>
        <Link href="/funcoes" className="text-xs font-semibold text-paideia-green-800 hover:underline">
          ← Funções
        </Link>
        <Eyebrow className="mt-3">Função {funcao.numero}</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">{funcao.nome}</h1>
      </div>

      {(funcao.o_que_forma || funcao.descricao) && (
        <Card className="space-y-2">
          {funcao.o_que_forma && (
            <div>
              <Eyebrow>O que forma</Eyebrow>
              <p className="mt-1 text-sm leading-relaxed text-paideia-ink/80">{funcao.o_que_forma}</p>
            </div>
          )}
          {funcao.descricao && <p className="text-sm leading-relaxed text-paideia-ink/70">{funcao.descricao}</p>}
        </Card>
      )}

      <section className="space-y-3">
        <p className="font-serif text-lg font-semibold">Obras que exercitam esta função</p>
        {obras.length === 0 ? (
          <EmptyState titulo="Nenhuma obra ligada a esta função ainda" />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {obras.map(({ obra, nota }) => (
              <li key={obra!.id}>
                <Link href={`/obras/${obra!.id}`} className="block">
                  <Card className="h-full transition hover:border-paideia-gold-400">
                    <p className="font-serif text-base font-semibold">{obra!.titulo}</p>
                    {obra!.autor && <p className="text-sm text-paideia-ink/60">{obra!.autor}</p>}
                    {nota && <p className="mt-1.5 text-sm text-paideia-ink/70">{nota}</p>}
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <p className="font-serif text-lg font-semibold">Exercícios</p>
        {exercicios.length === 0 ? (
          <EmptyState titulo="Nenhum exercício desta função ainda" />
        ) : (
          <ul className="space-y-2">
            {exercicios.map((e) => (
              <ExercicioItem key={e.id} exercicio={e} obra={e.obra?.ativo ? e.obra : null} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
