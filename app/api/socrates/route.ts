import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { conversaId, conteudo } = (await request.json()) as {
    conversaId: string;
    conteudo: string;
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

  const [{ data: historico }, { data: config }, { data: carteira }, { data: progressoTrilha }, { data: perfil }] =
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
      supabase
        .from("progresso_trilha")
        .select("status, percentual, foco_atual, etapa:etapas_trilha(titulo, codigo)")
        .eq("user_id", user.id)
        .order("atualizado_em", { ascending: false })
        .limit(5),
      supabase.from("perfis").select("nome, grau_atual").eq("id", user.id).single(),
    ]);

  const { data: mensagemUsuario } = await supabase
    .from("mensagens_socrates")
    .insert({ conversa_id: conversaId, user_id: user.id, remetente: "usuario", conteudo })
    .select("*")
    .single();

  const carteiraTexto = (carteira ?? [])
    .map((c: any) => `- ${c.ativo_ref?.titulo} (${c.ativo_ref?.autor ?? "autor desconhecido"}) — ${Math.round(c.progresso_percentual)}% concluído`)
    .join("\n");

  const trilhaTexto = (progressoTrilha ?? [])
    .map((p: any) => `- ${p.etapa?.codigo} ${p.etapa?.titulo} — ${Math.round(p.percentual)}%${p.foco_atual ? " (foco atual)" : ""}`)
    .join("\n");

  const contexto = `Discípulo: ${perfil?.nome ?? "desconhecido"} (${perfil?.grau_atual ?? "grau não definido"})

Carteira Intelectual (ativos em andamento/planejados):
${carteiraTexto || "Nenhum ativo em andamento."}

Trilha de Formação (progresso recente):
${trilhaTexto || "Nenhuma etapa iniciada."}`;

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
