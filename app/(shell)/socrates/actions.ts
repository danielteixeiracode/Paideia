"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MensagemSocrates, ModoSocrates } from "@/types/database";

async function inserirConversa(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  modo: ModoSocrates = "maieutico"
) {
  const { data } = await supabase
    .from("conversas_socrates")
    .insert({ user_id: userId, modo, titulo: "Novo diálogo" })
    .select("id")
    .single();
  return data?.id as string | undefined;
}

export async function criarConversa(modo: ModoSocrates = "maieutico") {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = await inserirConversa(supabase, user.id, modo);

  revalidatePath("/socrates");
  if (id) redirect(`/socrates?c=${id}`);
}

// Usada pela gaveta: a mesma conversa que /socrates abre por padrão (a mais
// recente), criada na hora se o aluno ainda não tiver nenhuma.
export async function abrirConversaAtual(): Promise<{
  conversaId: string;
  mensagens: MensagemSocrates[];
} | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: recente } = await supabase
    .from("conversas_socrates")
    .select("id")
    .eq("user_id", user.id)
    .order("atualizado_em", { ascending: false })
    .limit(1)
    .maybeSingle();

  const conversaId = (recente?.id as string | undefined) ?? (await inserirConversa(supabase, user.id));
  if (!conversaId) return null;

  const { data: mensagens } = await supabase
    .from("mensagens_socrates")
    .select("*")
    .eq("conversa_id", conversaId)
    .order("criado_em", { ascending: true });

  return { conversaId, mensagens: (mensagens ?? []) as MensagemSocrates[] };
}
