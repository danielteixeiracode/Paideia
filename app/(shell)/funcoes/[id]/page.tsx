import { notFound } from "next/navigation";
import { requirePerfil } from "@/lib/data/session";
import { ContextoTela } from "@/components/socrates/contexto-tela";
import { ColunaProgresso } from "@/components/ui/coluna-progresso";
import { TituloBloco } from "@/components/ui/titulo-bloco";
import { NavegacaoLivro } from "@/components/ui/navegacao-livro";
import { CartaoObra } from "@/components/corpo/cartao-obra";
import { ListaAtividade, type EventoAtividade } from "@/components/corpo/lista-atividade";
import { CAMPOS_CARTAO_OBRA, paraObraLista, type ObraBanco } from "@/lib/data/obras";
import { preenchimentoColuna } from "@/lib/templo";
import { romano } from "@/lib/utils";
import { ExerciciosDaFuncao, type ExercicioDaFuncao } from "./exercicios";

type Funcao = { id: string; numero: number; nome: string; o_que_forma: string | null; descricao: string | null };

export default async function FuncaoPage({ params }: { params: { id: string } }) {
  const { supabase, perfil } = await requirePerfil();

  const { data } = await supabase
    .from("funcoes_pedagogicas")
    .select("id, numero, nome, o_que_forma, descricao")
    .eq("id", params.id)
    .maybeSingle();
  if (!data) notFound();
  const funcao = data as Funcao;

  // Pela sessão do aluno (RLS): conteúdo publicado, a Carteira e os eventos dele.
  const [todasR, ligacoesR, exerciciosR, carteiraR, totalEventosR, eventosR] = await Promise.all([
    supabase.from("funcoes_pedagogicas").select("id, numero, nome").order("numero"),
    supabase.from("obra_funcoes").select(`nota, obra:obras(${CAMPOS_CARTAO_OBRA})`).eq("funcao_id", funcao.id),
    supabase
      .from("exercicios")
      .select("*, obra:obras(id, titulo, ativo)")
      .eq("funcao_id", funcao.id)
      .eq("ativo", true)
      .order("ordem"),
    supabase.from("carteira_obras").select("obra_id").eq("user_id", perfil.id),
    supabase.from("registro_eventos").select("id", { count: "exact", head: true }).eq("user_id", perfil.id).eq("funcao_id", funcao.id),
    supabase
      .from("registro_eventos")
      .select("id, tipo, criado_em, obra:obras(titulo), funcao:funcoes_pedagogicas(numero, nome), exercicio:exercicios(titulo)")
      .eq("user_id", perfil.id)
      .eq("funcao_id", funcao.id)
      .order("criado_em", { ascending: false })
      .limit(6),
  ]);

  const todas = (todasR.data ?? []) as { id: string; numero: number; nome: string }[];
  const naCarteira = new Set(((carteiraR.data ?? []) as { obra_id: string }[]).map((c) => c.obra_id));
  const obras = ((ligacoesR.data ?? []) as unknown as { nota: string | null; obra: ObraBanco | null }[])
    .filter((l) => l.obra?.ativo)
    .map((l) => ({ nota: l.nota, obra: paraObraLista(l.obra!, naCarteira) }))
    .sort((a, b) => a.obra.titulo.localeCompare(b.obra.titulo, "pt-BR"));

  // Exercícios de obras não publicadas ficam de fora; os de obra publicada
  // aparecem como "só desta obra".
  const exercicios: ExercicioDaFuncao[] = ((exerciciosR.data ?? []) as unknown as (Omit<ExercicioDaFuncao, "obra"> & { obra: { id: string; titulo: string; ativo: boolean } | null })[])
    .filter((e) => !e.obra_id || e.obra?.ativo)
    .map((e) => ({ ...e, obra: e.obra ? { id: e.obra.id, titulo: e.obra.titulo } : null }));

  const eventos = totalEventosR.count ?? 0;
  const atividade = (eventosR.data ?? []) as unknown as EventoAtividade[];

  const indice = todas.findIndex((f) => f.id === funcao.id);
  const vizinha = (f?: { id: string; numero: number; nome: string }) => (f ? { href: `/funcoes/${f.id}`, numero: f.numero, nome: f.nome } : null);

  return (
    <article className="space-y-12">
      <ContextoTela tipo="funcao" id={funcao.id} />

      <header className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="min-w-0">
          <div className="marcador max-w-md" aria-hidden>
            {romano(funcao.numero)}
          </div>
          <h1 className="t-display mt-3">
            <span className="sr-only">Função {funcao.numero}: </span>
            {funcao.nome}
          </h1>
          {funcao.o_que_forma && <p className="t-leitura mt-4">{funcao.o_que_forma}</p>}
          {funcao.descricao && <p className="t-corpo mt-3 max-w-leitura text-ink-muted">{funcao.descricao}</p>}
        </div>
        <figure className="flex flex-col items-center">
          <ColunaProgresso valor={preenchimentoColuna(eventos)} rotulo={`Sua coluna em ${funcao.nome}`} className="w-16" />
          <figcaption className="t-nota mt-2">{eventos === 1 ? "1 evento seu" : `${eventos} eventos seus`}</figcaption>
        </figure>
      </header>

      <section className="space-y-5">
        <TituloBloco titulo="Obras que carregam esta função" grande href="/obras" link="Todas as obras" />
        {obras.length === 0 ? (
          <p className="t-corpo text-ink-muted">Nenhuma obra publicada exercita esta função ainda.</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {obras.map(({ obra, nota }) => (
              <li key={obra.id}>
                <CartaoObra obra={obra} funcoes={todas} nota={nota} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-5">
        <TituloBloco titulo="Exercícios" grande />
        <ExerciciosDaFuncao exercicios={exercicios} />
      </section>

      <section className="space-y-3">
        <TituloBloco titulo="Sua atividade nesta função" grande />
        <ListaAtividade eventos={atividade} vazio="Você ainda não registrou nada nesta função." />
      </section>

      <NavegacaoLivro rotulo="Funções" anterior={vizinha(todas[indice - 1])} proxima={vizinha(todas[indice + 1])} />
    </article>
  );
}
