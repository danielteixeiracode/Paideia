import { requirePerfil } from "@/lib/data/session";
import { ContextoTela } from "@/components/socrates/contexto-tela";
import { TituloBloco } from "@/components/ui/titulo-bloco";
import { CAMPOS_CARTAO_OBRA, paraObraLista, type ObraBanco } from "@/lib/data/obras";
import { SementesCarteira } from "./sementes";
import { FrutosCarteira, type FrutoLinha } from "./frutos";

export default async function CarteiraPage() {
  const { supabase, perfil } = await requirePerfil();

  // Só os dados do aluno (RLS e filtro por user_id).
  const [carteiraR, frutosR, funcoesR] = await Promise.all([
    supabase
      .from("carteira_obras")
      .select(`obra_id, obra:obras(${CAMPOS_CARTAO_OBRA})`)
      .eq("user_id", perfil.id)
      .order("atualizado_em", { ascending: false }),
    supabase
      .from("frutos")
      .select("id, tipo, conteudo, criado_em, obra_id, obra:obras(id, titulo), funcao:funcoes_pedagogicas(numero, nome), exercicio:exercicios(titulo)")
      .eq("user_id", perfil.id)
      .order("criado_em", { ascending: false }),
    supabase.from("funcoes_pedagogicas").select("id, numero, nome").order("numero"),
  ]);

  const frutos = (frutosR.data ?? []) as unknown as (FrutoLinha & { obra_id: string | null })[];

  // Semente: obra guardada que ainda não deu nenhum fruto. Quando dá o
  // primeiro, ela passa a aparecer pelos frutos.
  const obrasComFruto = new Set(frutos.map((f) => f.obra_id).filter(Boolean));
  const vazio = new Set<string>();
  const sementes = ((carteiraR.data ?? []) as unknown as { obra_id: string; obra: ObraBanco | null }[])
    .filter((i) => i.obra && !obrasComFruto.has(i.obra_id))
    .map((i) => paraObraLista(i.obra!, vazio));

  const nSementes = sementes.length;
  const nFrutos = frutos.length;

  return (
    <div className="space-y-12">
      <ContextoTela tipo="nenhum" />

      <header>
        <div className="marcador max-w-md" aria-hidden>
          V
        </div>
        <h1 className="t-display mt-3">Carteira</h1>
        <p className="t-leitura mt-3 text-ink-muted">O livro entra como semente; o fruto é o ativo.</p>
        <p className="t-nota mt-4">
          {nSementes === 1 ? "1 semente" : `${nSementes} sementes`} e {nFrutos === 1 ? "1 fruto" : `${nFrutos} frutos`}
        </p>
      </header>

      <section className="space-y-5">
        <TituloBloco titulo="Sementes" grande href="/obras" link="Obras" />
        <SementesCarteira sementes={sementes} funcoes={(funcoesR.data ?? []) as { id: string; numero: number; nome: string }[]} />
      </section>

      <section className="space-y-3">
        <TituloBloco titulo="Frutos" grande />
        <FrutosCarteira frutos={frutos} agora={new Date().toISOString()} />
      </section>
    </div>
  );
}
