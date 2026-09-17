"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toISODate } from "@/lib/utils";
import type { StatusCarteira } from "@/types/database";

export async function atualizarStatusCarteira(id: string, status: StatusCarteira) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const dados: Record<string, unknown> = { status };
  if (status === "em_andamento") {
    dados.data_inicio = toISODate(new Date());
  }
  if (status === "concluido") {
    dados.data_conclusao = toISODate(new Date());
    dados.progresso_percentual = 100;
  }

  await supabase.from("carteira_itens").update(dados).eq("id", id).eq("user_id", user.id);

  revalidatePath("/carteira");
  revalidatePath("/inicio");
}

export async function atualizarDetalhesCarteira(
  id: string,
  dados: {
    progresso_percentual: number;
    horas_investidas: number;
    nota: number | null;
    anotacoes: string | null;
  }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("carteira_itens").update(dados).eq("id", id).eq("user_id", user.id);

  revalidatePath("/carteira");
  revalidatePath("/inicio");
}

export async function removerItemCarteira(id: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("carteira_itens").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/carteira");
  revalidatePath("/inicio");
}
