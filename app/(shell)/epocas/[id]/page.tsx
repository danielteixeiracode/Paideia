import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePerfil } from "@/lib/data/session";
import { ContextoTela } from "@/components/socrates/contexto-tela";
import { TituloBloco } from "@/components/ui/titulo-bloco";
import { NavegacaoLivro } from "@/components/ui/navegacao-livro";
import { CartaoObra } from "@/components/corpo/cartao-obra";
import { CAMPOS_CARTAO_OBRA, paraObraLista, type ObraBanco } from "@/lib/data/obras";
import { romano } from "@/lib/utils";

type Epoca = { id: string; numero: number; nome: string; descricao: string | null };

export default async function EpocaPage({ params }: { params: { id: string } }) {
  const { supabase, perfil } = await requirePerfil();

  const { data } = await supabase.from("epocas").select("id, numero, nome, descricao").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  const epoca = data as Epoca;

  // Pela sessão do aluno (RLS): obras publicadas e a Carteira dele.
  const [todasR, obrasR, funcoesR, carteiraR] = await Promise.all([
    supabase.from("epocas").select("id, numero, nome").order("numero"),
    supabase.from("obras").select(CAMPOS_CARTAO_OBRA).eq("epoca_id", epoca.id).eq("ativo", true).order("ordem").order("titulo"),
    supabase.from("funcoes_pedagogicas").select("id, numero, nome").order("numero"),
    supabase.from("carteira_obras").select("obra_id").eq("user_id", perfil.id),
  ]);

  const todas = (todasR.data ?? []) as { id: string; numero: number; nome: string }[];
  const naCarteira = new Set(((carteiraR.data ?? []) as { obra_id: string }[]).map((c) => c.obra_id));
  const obras = ((obrasR.data ?? []) as unknown as ObraBanco[]).map((o) => paraObraLista(o, naCarteira));
  const funcoes = (funcoesR.data ?? []) as { id: string; numero: number; nome: string }[];

  const indice = todas.findIndex((e) => e.id === epoca.id);
  const vizinha = (e?: { id: string; numero: number; nome: string }) => (e ? { href: `/epocas/${e.id}`, numero: e.numero, nome: e.nome } : null);

  return (
    <article className="space-y-12">
      <ContextoTela tipo="epoca" id={epoca.id} />

      <header>
        <div className="marcador max-w-md" aria-hidden>
          {romano(epoca.numero)}
        </div>
        <h1 className="t-display mt-3">
          <span className="sr-only">Época {epoca.numero}: </span>
          {epoca.nome}
        </h1>
        {epoca.descricao && <p className="t-leitura mt-4">{epoca.descricao}</p>}
      </header>

      <section className="space-y-5">
        <TituloBloco titulo="Obras desta época" grande href="/epocas" link="Todas as épocas" />
        {obras.length === 0 ? (
          <p className="t-corpo text-ink-muted">
            Nenhuma obra desta época na formação ainda. Veja as{" "}
            <Link href="/obras" className="text-accent underline underline-offset-4">
              obras de outras épocas
            </Link>
            .
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {obras.map((o) => (
              <li key={o.id}>
                <CartaoObra obra={o} funcoes={funcoes} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <NavegacaoLivro rotulo="Épocas" anterior={vizinha(todas[indice - 1])} proxima={vizinha(todas[indice + 1])} />
    </article>
  );
}
