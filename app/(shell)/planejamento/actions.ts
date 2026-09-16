"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function criarAtividade(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const titulo = String(formData.get("titulo") ?? "").trim();
  const data = String(formData.get("data") ?? "");
  const periodo = String(formData.get("periodo") ?? "matutino");
  const duracao_min = Number(formData.get("duracao_min") ?? 30);
  const eixo_id = String(formData.get("eixo_id") ?? "") || null;

  if (!titulo || !data) return;

  await supabase.from("atividades_planejadas").insert({
    user_id: user.id,
    titulo,
    data,
    periodo,
    duracao_min,
    eixo_id,
    status: "pendente",
  });

  revalidatePath("/planejamento");
  revalidatePath("/hoje");
}

export async function removerAtividade(atividadeId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("atividades_planejadas").delete().eq("id", atividadeId).eq("user_id", user.id);

  revalidatePath("/planejamento");
  revalidatePath("/hoje");
}
