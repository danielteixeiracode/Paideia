import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/data/session";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { Cartao } from "@/components/ui/cartao";
import { Selo } from "@/components/ui/selo";
import { TituloBloco } from "@/components/ui/titulo-bloco";
import { classesBotao } from "@/components/ui/botao";
import { quandoRelativo, romano } from "@/lib/utils";

type Alterada = {
  id: string;
  titulo: string;
  ativo: boolean;
  atualizado_em: string;
  funcao?: { numero: number } | null;
};

export default async function AdminPage() {
  const { supabase } = await requireAdmin();
  const contar = (tabela: "obras" | "exercicios" | "perfis" | "frutos") =>
    supabase.from(tabela).select("id", { count: "exact", head: true });

  const [obrasPub, obrasRasc, exPub, exRasc, usuarios, frutos, obrasR, exerciciosR] = await Promise.all([
    contar("obras").eq("ativo", true),
    contar("obras").eq("ativo", false),
    contar("exercicios").eq("ativo", true),
    contar("exercicios").eq("ativo", false),
    contar("perfis"),
    contar("frutos"),
    supabase.from("obras").select("id, titulo, ativo, atualizado_em").order("atualizado_em", { ascending: false }).limit(5),
    supabase
      .from("exercicios")
      .select("id, titulo, ativo, atualizado_em, funcao:funcoes_pedagogicas(numero)")
      .order("atualizado_em", { ascending: false })
      .limit(5),
  ]);

  const obras = (obrasR.data ?? []) as Alterada[];
  const exercicios = (exerciciosR.data ?? []) as unknown as Alterada[];
  const agora = new Date();

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="marcador max-w-md" aria-hidden>
            I
          </div>
          <h1 className="t-titulo mt-3">Administração</h1>
          <p className="t-nota mt-1">O acervo da formação e quem o usa.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/obras/nova" className={classesBotao()}>
            <Plus className="h-4 w-4" aria-hidden /> Nova obra
          </Link>
          <Link href="/admin/exercicios/novo" className={classesBotao({ variante: "secundario" })}>
            <Plus className="h-4 w-4" aria-hidden /> Novo exercício
          </Link>
        </div>
      </header>

      <AdminTabs />

      <section aria-label="Números do acervo">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Numero rotulo="Obras" href="/admin/obras" valores={[[obrasPub.count, "publicadas"], [obrasRasc.count, "em rascunho"]]} />
          <Numero
            rotulo="Exercícios"
            href="/admin/exercicios"
            valores={[[exPub.count, "publicados"], [exRasc.count, "em rascunho"]]}
          />
          <Numero rotulo="Usuários" href="/admin/usuarios" valores={[[usuarios.count, "contas"]]} />
          <Numero rotulo="Frutos" valores={[[frutos.count, "colhidos pelos alunos"]]} />
        </ul>
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        <section className="space-y-2">
          <TituloBloco titulo="Obras alteradas por último" href="/admin/obras" link="Todas as obras" />
          <ListaAlteradas itens={obras} base="/admin/obras" agora={agora} vazio="Nenhuma obra cadastrada ainda." />
        </section>
        <section className="space-y-2">
          <TituloBloco titulo="Exercícios alterados por último" href="/admin/exercicios" link="Todos os exercícios" />
          <ListaAlteradas itens={exercicios} base="/admin/exercicios" agora={agora} vazio="Nenhum exercício cadastrado ainda." />
        </section>
      </div>
    </div>
  );
}

function Numero({
  rotulo,
  valores,
  href,
}: {
  rotulo: string;
  valores: [number | null, string][];
  href?: string;
}) {
  const conteudo = (
    <Cartao className="h-full">
      <h2 className="text-interface font-semibold text-ink">{rotulo}</h2>
      <div className="mt-3 space-y-1">
        {valores.map(([n, legenda]) => (
          <p key={legenda} className="flex items-baseline gap-2">
            <span className="font-serif text-titulo leading-none text-ink" style={{ fontVariantNumeric: "tabular-nums" }}>
              {n ?? 0}
            </span>
            <span className="t-nota">{legenda}</span>
          </p>
        ))}
      </div>
    </Cartao>
  );
  return (
    <li>
      {href ? (
        <Link href={href} className="block h-full rounded-2xl transition-colors duration-discreto ease-discreto hover:[&>*]:border-rule-strong/70">
          {conteudo}
        </Link>
      ) : (
        conteudo
      )}
    </li>
  );
}

function ListaAlteradas({ itens, base, agora, vazio }: { itens: Alterada[]; base: string; agora: Date; vazio: string }) {
  if (itens.length === 0) return <p className="t-corpo pt-2 text-ink-muted">{vazio}</p>;
  return (
    <ul className="divide-y-hair divide-rule-strong/40">
      {itens.map((i) => (
        <li key={i.id}>
          <Link href={`${base}/${i.id}/editar`} className="group flex items-baseline gap-3 py-3">
            {i.funcao !== undefined && (
              <span aria-hidden className="t-romano w-8 shrink-0 text-nota text-gold-ink">
                {i.funcao ? romano(i.funcao.numero) : ""}
              </span>
            )}
            <span className="min-w-0 flex-1 truncate text-interface text-ink group-hover:underline group-hover:underline-offset-4">{i.titulo}</span>
            {!i.ativo && <Selo>Rascunho</Selo>}
            <time dateTime={i.atualizado_em} className="t-nota shrink-0">
              {quandoRelativo(i.atualizado_em, agora)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
