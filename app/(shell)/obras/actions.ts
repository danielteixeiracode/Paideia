"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ResultadoAcao } from "@/lib/acoes";

function revalidar(obraId: string) {
  revalidatePath(`/obras/${obraId}`);
  revalidatePath("/carteira");
  revalidatePath("/inicio");
}

export async function guardarObra(obraId: string): Promise<ResultadoAcao> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: "Sua sessão terminou. Entre de novo para guardar a obra." };

  const { data: obra } = await supabase.from("obras").select("id").eq("id", obraId).eq("ativo", true).maybeSingle();
  if (!obra) return { ok: false, erro: "Esta obra não está mais disponível." };

  const { data: guardada, error } = await supabase
    .from("carteira_obras")
    .upsert(
      { user_id: user.id, obra_id: obraId, estado: "semente" },
      { onConflict: "user_id,obra_id", ignoreDuplicates: true }
    )
    .select("id");
  if (error) return { ok: false, erro: "Não foi possível guardar a obra. Tente de novo." };

  // Só registra o evento se a obra entrou de fato (não estava guardada).
  if (guardada?.length) {
    await supabase.from("registro_eventos").insert({ user_id: user.id, tipo: "obra_guardada", obra_id: obraId });
  }

  revalidar(obraId);
  return { ok: true };
}

export async function removerObra(obraId: string): Promise<ResultadoAcao> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: "Sua sessão terminou. Entre de novo para remover a obra." };

  const { data: removida, error } = await supabase
    .from("carteira_obras")
    .delete()
    .eq("user_id", user.id)
    .eq("obra_id", obraId)
    .select("id");
  if (error) return { ok: false, erro: "Não foi possível remover a obra. Tente de novo." };

  if (removida?.length) {
    await supabase.from("registro_eventos").insert({ user_id: user.id, tipo: "obra_removida", obra_id: obraId });
  }

  revalidar(obraId);
  return { ok: true };
}
