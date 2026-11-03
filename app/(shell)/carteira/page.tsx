import Link from "next/link";
import { requirePerfil } from "@/lib/data/session";
import { Card, Eyebrow, Badge, EmptyState } from "@/components/ui/primitives";
import type { CarteiraObra, Fruto, Obra } from "@/types/database";

type FrutoLista = Fruto & {
  obra: { id: string; titulo: string } | null;
  funcao: { id: string; nome: string } | null;
  exercicio: { id: string; titulo: string } | null;
};

export default async function CarteiraPage() {
  const { supabase, perfil } = await requirePerfil();

  const [{ data: obrasData }, { data: frutosData }] = await Promise.all([
    supabase
      .from("carteira_obras")
      .select("*, obra:obras(*)")
      .eq("user_id", perfil.id)
      .order("atualizado_em", { ascending: false }),
    supabase
      .from("frutos")
      .select("*, obra:obras(id, titulo), funcao:funcoes_pedagogicas(id, nome), exercicio:exercicios(id, titulo)")
      .eq("user_id", perfil.id)
      .order("criado_em", { ascending: false }),
  ]);

  const itens = ((obrasData ?? []) as unknown as (CarteiraObra & { obra: Obra | null })[]).filter((i) => i.obra);
  const frutos = (frutosData ?? []) as unknown as FrutoLista[];

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>O livro entra como semente; o fruto é o ativo</Eyebrow>
        <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">Carteira Intelectual</h1>
      </div>

      <section className="space-y-3">
        <p className="font-serif text-lg font-semibold">Obras</p>
        {itens.length === 0 ? (
          <EmptyState
            titulo="Nenhuma obra na sua Carteira ainda"
            descricao="As obras que você guardar aparecem aqui."
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {itens.map((item) => (
              <li key={item.id}>
                <Link href={`/obras/${item.obra!.id}`} className="block">
                  <Card className="flex h-full items-start justify-between gap-3 transition hover:border-paideia-gold-400">
                    <div className="min-w-0">
                      <p className="font-serif text-base font-semibold">{item.obra!.titulo}</p>
                      {item.obra!.autor && <p className="text-sm text-paideia-ink/60">{item.obra!.autor}</p>}
                    </div>
                    <Badge tone="gold" className="shrink-0">{item.estado}</Badge>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <p className="font-serif text-lg font-semibold">Frutos</p>
        {frutos.length === 0 ? (
          <EmptyState
            titulo="Nenhum fruto ainda"
            descricao="O que você produzir nos exercícios aparece aqui."
          />
        ) : (
          <ul className="space-y-3">
            {frutos.map((f) => (
              <li key={f.id}>
                <Card>
                  <Badge>{f.tipo}</Badge>
                  <p className="mt-2 line-clamp-4 whitespace-pre-line text-sm text-paideia-ink/80">{f.conteudo}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {f.obra && (
                      <Link href={`/obras/${f.obra.id}`} className="font-semibold text-paideia-green-800 hover:underline">
                        Obra: {f.obra.titulo}
                      </Link>
                    )}
                    {f.funcao && (
                      <Link href={`/funcoes/${f.funcao.id}`} className="font-semibold text-paideia-green-800 hover:underline">
                        Função: {f.funcao.nome}
                      </Link>
                    )}
                    {f.exercicio && <span className="text-paideia-ink/50">Exercício: {f.exercicio.titulo}</span>}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
