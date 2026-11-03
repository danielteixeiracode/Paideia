import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { TIPOS_CONTEXTO, type ContextoTela } from "@/lib/socrates";
import { ehPerguntaSocrates } from "@/lib/perguntas-socrates";

export const runtime = "nodejs";

const FONTE_CONTEXTO = {
  obra: { tabela: "obras", coluna: "titulo", rotulo: "obra" },
  funcao: { tabela: "funcoes_pedagogicas", coluna: "nome", rotulo: "função" },
  epoca: { tabela: "epocas", coluna: "nome", rotulo: "época" },
  exercicio: { tabela: "exercicios", coluna: "titulo", rotulo: "exercício" },
} as const;

// Uma linha dizendo ao Sócrates o que o aluno tem na tela, ou null.
async function descreverTela(supabase: ReturnType<typeof createClient>, contexto?: ContextoTela) {
  if (!contexto?.id || !(TIPOS_CONTEXTO as readonly string[]).includes(contexto.tipo)) return null;
  const fonte = FONTE_CONTEXTO[contexto.tipo as keyof typeof FONTE_CONTEXTO];
  const { data } = await supabase.from(fonte.tabela).select(fonte.coluna).eq("id", contexto.id).maybeSingle();
  const nome = (data as Record<string, string> | null)?.[fonte.coluna];
  return nome ? `O aluno está vendo: ${fonte.rotulo} ${nome}` : null;
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { conversaId, conteudo, contexto: contextoTela, pergunta } = (await request.json()) as {
    conversaId: string;
    conteudo: string;
    contexto?: ContextoTela;
    pergunta?: string;
  };

  if (!conversaId || !conteudo?.trim()) {
    return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
  }

  const { data: conversa } = await supabase
    .from("conversas_socrates")
    .select("*")
    .eq("id", conversaId)
    .eq("user_id", user.id)
    .single();

  if (!conversa) {
    return NextResponse.json({ error: "Diálogo não encontrado." }, { status: 404 });
  }

  const [{ data: historico }, { data: config }, { data: carteira }, { data: perfil }] =
    await Promise.all([
      supabase
        .from("mensagens_socrates")
        .select("*")
        .eq("conversa_id", conversaId)
        .order("criado_em", { ascending: true })
        .limit(30),
      supabase.from("config_socrates").select("*").eq("ativo", true).order("atualizado_em", { ascending: false }).limit(1).maybeSingle(),
      supabase
        .from("carteira_itens")
        .select("status, progresso_percentual, ativo_ref:ativos(titulo, autor)")
        .eq("user_id", user.id)
        .neq("status", "concluido")
        .limit(8),
      supabase.from("perfis").select("nome, grau_atual").eq("id", user.id).single(),
    ]);

  const { data: mensagemUsuario } = await supabase
    .from("mensagens_socrates")
    .insert({ conversa_id: conversaId, user_id: user.id, remetente: "usuario", conteudo })
    .select("*")
    .single();

  const linhaTela = await descreverTela(supabase, contextoTela);
  // Só perguntas do próprio Sócrates (lib/perguntas-socrates.ts) entram no prompt.
  const linhaPergunta = ehPerguntaSocrates(pergunta) ? `O aluno está respondendo a esta pergunta sua: "${pergunta}"` : null;

  const carteiraTexto = (carteira ?? [])
    .map((c: any) => `- ${c.ativo_ref?.titulo} (${c.ativo_ref?.autor ?? "autor desconhecido"}) — ${Math.round(c.progresso_percentual)}% concluído`)
    .join("\n");

  const contexto = `Discípulo: ${perfil?.nome ?? "desconhecido"} (${perfil?.grau_atual ?? "grau não definido"})

Carteira Intelectual (ativos em andamento/planejados):
${carteiraTexto || "Nenhum ativo em andamento."}${linhaTela ? `\n\n${linhaTela}` : ""}${linhaPergunta ? `\n${linhaPergunta}` : ""}`;

  const systemPrompt = `${config?.system_prompt ?? "Você é Sócrates, mentor da Paideia. Conduza pelo método maiêutico."}\n\n---\nCONTEXTO DO DISCÍPULO:\n${contexto}`;

  const historicoFormatado = [
    ...(historico ?? []).map((m) => ({
      role: m.remetente === "usuario" ? ("user" as const) : ("assistant" as const),
      content: m.conteudo,
    })),
    { role: "user" as const, content: conteudo },
  ];

  let respostaTexto = "";
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const resposta = await anthropic.messages.create({
      model: config?.modelo || "claude-sonnet-5",
      max_tokens: config?.max_tokens || 1024,
      temperature: config?.temperatura ?? 0.7,
      system: systemPrompt,
      messages: historicoFormatado,
    });
    const bloco = resposta.content.find((b) => b.type === "text");
    respostaTexto = bloco && bloco.type === "text" ? bloco.text : "";
  } catch (err) {
    console.error("Erro ao consultar Sócrates:", err);
    return NextResponse.json(
      { error: "Sócrates está em silêncio contemplativo — tente novamente em instantes." },
      { status: 502 }
    );
  }

  const { data: mensagemSocrates } = await supabase
    .from("mensagens_socrates")
    .insert({ conversa_id: conversaId, user_id: user.id, remetente: "socrates", conteudo: respostaTexto })
    .select("*")
    .single();

  const novoTitulo = conversa.titulo === "Novo diálogo" ? conteudo.slice(0, 48) : conversa.titulo;
  await supabase
    .from("conversas_socrates")
    .update({ atualizado_em: new Date().toISOString(), titulo: novoTitulo })
    .eq("id", conversaId);

  return NextResponse.json({ mensagemUsuario, mensagemSocrates });
}
