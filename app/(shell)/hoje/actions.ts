"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toISODate } from "@/lib/utils";

export async function concluirAtividade(atividadeId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: atividade } = await supabase
    .from("atividades_planejadas")
    .select("*")
    .eq("id", atividadeId)
    .eq("user_id", user.id)
    .single();

  if (!atividade) return;

  await supabase
    .from("atividades_planejadas")
    .update({ status: "concluida", concluida_em: new Date().toISOString() })
    .eq("id", atividadeId);

  await supabase.from("registros_estudo").insert({
    user_id: user.id,
    atividade_id: atividadeId,
    ativo_id: atividade.ativo_id,
    etapa_id: atividade.etapa_id,
    eixo_id: atividade.eixo_id,
    data: atividade.data,
    duracao_min: atividade.duracao_min,
  });

  const hoje = toISODate(new Date());
  const { data: constancia } = await supabase
    .from("constancia_diaria")
    .select("*")
    .eq("user_id", user.id)
    .eq("data", hoje)
    .maybeSingle();

  await supabase.from("constancia_diaria").upsert(
    {
      user_id: user.id,
      data: hoje,
      estudou: true,
      minutos_total: (constancia?.minutos_total ?? 0) + atividade.duracao_min,
      eixo_predominante_id: atividade.eixo_id,
    },
    { onConflict: "user_id,data" }
  );

  revalidatePath("/hoje");
  revalidatePath("/inicio");
  revalidatePath("/planejamento");
}

export async function adiarAtividade(atividadeId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const amanha = toISODate(new Date(Date.now() + 86400000));
  await supabase
    .from("atividades_planejadas")
    .update({ data: amanha, status: "pendente" })
    .eq("id", atividadeId)
    .eq("user_id", user.id);

  revalidatePath("/hoje");
  revalidatePath("/planejamento");
}
