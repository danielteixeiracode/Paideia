// Contexto do aluno para o Sócrates, montado no servidor a cada mensagem.
//
// Lê o corpo novo (carteira_obras, frutos, registro_eventos) sempre pela
// sessão do próprio aluno: o RLS e o filtro por user_id garantem que nenhum
// dado de outro aluno entra. Nada daqui vai para o navegador.

import type { createClient } from "@/lib/supabase/server";
import { TIPOS_CONTEXTO, type ContextoTela } from "@/lib/socrates";
import { ehPerguntaSocrates } from "@/lib/perguntas-socrates";
import { descreverEvento } from "@/lib/eventos";
import { quandoRelativo, romano } from "@/lib/utils";

type Supabase = ReturnType<typeof createClient>;

// Bloco fixo entre o prompt-base e o resumo. Não muda de aluno para aluno.
export const ORIENTACOES_RESUMO = `Abaixo vem um resumo do que este aluno já fez no Paideia. Use-o para perguntar melhor: partir do que ele leu, do que já produziu e das funções que exercitou pouco.
- Não use o resumo para elogiar nem para cobrar.
- Não mencione números, contagens nem nomes de tabelas ou de campos do sistema.
- Nunca faça o exercício pelo aluno, nem escreva o fruto por ele.
- Se o aluno quiser mudar de assunto, acompanhe-o.`;

// Cerca de 1500 tokens (uns 4 caracteres por token em português).
const LIMITE_CARACTERES = 6000;
const TRECHO_MAX = 200;
export const SEM_REGISTRO = "O aluno ainda não registrou nada.";

const FONTE_TELA = {
  obra: { tabela: "obras", coluna: "titulo", rotulo: "obra" },
  funcao: { tabela: "funcoes_pedagogicas", coluna: "nome", rotulo: "função" },
  epoca: { tabela: "epocas", coluna: "nome", rotulo: "época" },
  exercicio: { tabela: "exercicios", coluna: "titulo", rotulo: "exercício" },
} as const;

// Uma linha dizendo o que o aluno tem na tela, ou null.
async function descreverTela(supabase: Supabase, contexto?: ContextoTela) {
  if (!contexto?.id || !(TIPOS_CONTEXTO as readonly string[]).includes(contexto.tipo)) return null;
  const fonte = FONTE_TELA[contexto.tipo as keyof typeof FONTE_TELA];
  const { data } = await supabase.from(fonte.tabela).select(fonte.coluna).eq("id", contexto.id).maybeSingle();
  const nome = (data as Record<string, string> | null)?.[fonte.coluna];
  return nome ? `${fonte.rotulo} ${nome}` : null;
}

type ObraNaCarteira = { obra_id: string; obra: { titulo: string; autor: string | null; epoca: { nome: string } | null } | null };
type FrutoRecente = {
  conteudo: string;
  obra: { titulo: string } | null;
  funcao: { numero: number; nome: string } | null;
  exercicio: { titulo: string } | null;
};
type EventoRecente = {
  tipo: string;
  criado_em: string;
  obra: { titulo: string } | null;
  funcao: { nome: string } | null;
  exercicio: { titulo: string } | null;
};

function trecho(texto: string) {
  const limpo = texto.replace(/\s+/g, " ").trim();
  return limpo.length > TRECHO_MAX ? `${limpo.slice(0, TRECHO_MAX - 1).trimEnd()}…` : limpo;
}

function plural(n: number, um: string, varios: string) {
  return n === 1 ? `1 ${um}` : `${n} ${varios}`;
}

export async function montarResumoAluno(
  supabase: Supabase,
  userId: string,
  { tela, pergunta }: { tela?: ContextoTela; pergunta?: string } = {}
) {
  const [perfilR, carteiraR, frutosObraR, frutosR, funcoesR, eventosFuncaoR, eventosR, linhaTela] = await Promise.all([
    supabase.from("perfis").select("nome").eq("id", userId).maybeSingle(),
    supabase
      .from("carteira_obras")
      .select("obra_id, obra:obras(titulo, autor, epoca:epocas(nome))")
      .eq("user_id", userId)
      .order("atualizado_em", { ascending: false })
      .limit(30),
    supabase.from("frutos").select("obra_id").eq("user_id", userId).not("obra_id", "is", null),
    supabase
      .from("frutos")
      .select("conteudo, obra:obras(titulo), funcao:funcoes_pedagogicas(numero, nome), exercicio:exercicios(titulo)")
      .eq("user_id", userId)
      .order("criado_em", { ascending: false })
      .limit(5),
    supabase.from("funcoes_pedagogicas").select("id, numero, nome").order("numero"),
    supabase.from("registro_eventos").select("funcao_id").eq("user_id", userId).not("funcao_id", "is", null),
    supabase
      .from("registro_eventos")
      .select("tipo, criado_em, obra:obras(titulo), funcao:funcoes_pedagogicas(nome), exercicio:exercicios(titulo)")
      .eq("user_id", userId)
      .order("criado_em", { ascending: false })
      .limit(10),
    descreverTela(supabase, tela),
  ]);

  const carteira = ((carteiraR.data ?? []) as unknown as ObraNaCarteira[]).filter((c) => c.obra);
  const frutos = (frutosR.data ?? []) as unknown as FrutoRecente[];
  const eventos = (eventosR.data ?? []) as unknown as EventoRecente[];
  const funcoes = (funcoesR.data ?? []) as { id: string; numero: number; nome: string }[];

  const frutosPorObra = new Map<string, number>();
  for (const f of (frutosObraR.data ?? []) as { obra_id: string }[]) {
    frutosPorObra.set(f.obra_id, (frutosPorObra.get(f.obra_id) ?? 0) + 1);
  }
  const eventosPorFuncao = new Map<string, number>();
  for (const e of (eventosFuncaoR.data ?? []) as { funcao_id: string }[]) {
    eventosPorFuncao.set(e.funcao_id, (eventosPorFuncao.get(e.funcao_id) ?? 0) + 1);
  }

  const cabecalho = perfilR.data?.nome ? `Aluno: ${perfilR.data.nome}` : null;
  const finais = [
    linhaTela ? `Tela atual: ${linhaTela}` : null,
    ehPerguntaSocrates(pergunta) ? `Está respondendo a esta pergunta sua, feita no Início: "${pergunta}"` : null,
  ].filter(Boolean) as string[];

  const semDados = carteira.length === 0 && frutos.length === 0 && eventos.length === 0;
  if (semDados) return [cabecalho, SEM_REGISTRO, ...finais].filter(Boolean).join("\n");

  const secaoCarteira = () =>
    carteira.length === 0
      ? "Obras na Carteira: nenhuma."
      : [
          "Obras na Carteira:",
          ...carteira.map((c) => {
            const o = c.obra!;
            const n = frutosPorObra.get(c.obra_id) ?? 0;
            return `- ${o.titulo}${o.autor ? `, de ${o.autor}` : ""}${o.epoca ? ` (${o.epoca.nome})` : ""}: ${n === 0 ? "nenhum fruto ainda" : plural(n, "fruto", "frutos")}`;
          }),
        ].join("\n");

  const secaoFrutos = (comTrechos: boolean) =>
    frutos.length === 0
      ? "Frutos: nenhum ainda."
      : [
          "Frutos mais recentes:",
          ...frutos.map((f, i) => {
            const titulo = f.exercicio?.titulo ?? (f.obra ? `fruto de ${f.obra.titulo}` : "fruto sem exercício");
            const funcao = f.funcao ? ` (função ${romano(f.funcao.numero)}, ${f.funcao.nome})` : "";
            const texto = comTrechos && i < 3 && f.conteudo.trim() ? `: "${trecho(f.conteudo)}"` : "";
            return `- ${titulo}${funcao}${texto}`;
          }),
        ].join("\n");

  const contagens = funcoes.map((f) => ({ ...f, n: eventosPorFuncao.get(f.id) ?? 0 }));
  const secaoPerfil = () => {
    if (contagens.length === 0) return null;
    const max = Math.max(...contagens.map((c) => c.n));
    const min = Math.min(...contagens.map((c) => c.n));
    const nomes = (v: number) => contagens.filter((c) => c.n === v).map((c) => c.nome).join(", ");
    return [
      "Perfil por função (eventos registrados):",
      ...contagens.map((c) => `- ${romano(c.numero)} ${c.nome}: ${c.n}`),
      max === min ? "Todas as funções estão igualmente exercitadas." : `Mais exercitada: ${nomes(max)}. Menos exercitada: ${nomes(min)}.`,
    ].join("\n");
  };

  const agora = new Date();
  const secaoEventos = (quantos: number) =>
    eventos.length === 0 || quantos === 0
      ? null
      : ["Últimos registros:", ...eventos.slice(0, quantos).map((e) => `- ${quandoRelativo(e.criado_em, agora)}: ${descreverEvento(e)}`)].join("\n");

  const montar = (comTrechos: boolean, quantosEventos: number) =>
    [cabecalho, secaoCarteira(), secaoFrutos(comTrechos), secaoPerfil(), secaoEventos(quantosEventos), finais.join("\n") || null]
      .filter(Boolean)
      .join("\n\n");

  // Acima do limite: cortar primeiro os trechos de texto, depois os eventos mais antigos.
  let resumo = montar(true, eventos.length);
  if (resumo.length > LIMITE_CARACTERES) resumo = montar(false, eventos.length);
  for (let n = eventos.length - 1; resumo.length > LIMITE_CARACTERES && n >= 0; n--) resumo = montar(false, n);
  if (resumo.length > LIMITE_CARACTERES) resumo = `${resumo.slice(0, LIMITE_CARACTERES - 1)}…`;
  return resumo;
}

// Ordem do prompt: prompt-base (estável, primeiro, para o cache), orientações
// fixas e, por último, o resumo deste aluno.
export function montarPromptSistema(promptBase: string, resumo: string) {
  return `${promptBase}\n\n---\n${ORIENTACOES_RESUMO}\n\n---\nRESUMO DO ALUNO:\n${resumo}`;
}
