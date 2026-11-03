import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import type { ContextoTela } from "@/lib/socrates";
import { montarPromptSistema, montarResumoAluno } from "@/lib/socrates-contexto";

export const runtime = "nodejs";

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

  // O resumo do aluno é lido pela sessão dele, antes de gravar a mensagem nova.
  const [{ data: historico }, { data: config }, resumo] = await Promise.all([
    supabase
      .from("mensagens_socrates")
      .select("*")
      .eq("conversa_id", conversaId)
      .order("criado_em", { ascending: true })
      .limit(30),
    supabase.from("config_socrates").select("*").eq("ativo", true).order("atualizado_em", { ascending: false }).limit(1).maybeSingle(),
    montarResumoAluno(supabase, user.id, { tela: contextoTela, pergunta }),
  ]);

  const { data: mensagemUsuario } = await supabase
    .from("mensagens_socrates")
    .insert({ conversa_id: conversaId, user_id: user.id, remetente: "usuario", conteudo })
    .select("*")
    .single();

  const systemPrompt = montarPromptSistema(
    config?.system_prompt ?? "Você é Sócrates, mentor da Paideia. Conduza pelo método maiêutico.",
    resumo
  );

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
