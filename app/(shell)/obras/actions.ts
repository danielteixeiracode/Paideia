"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function revalidar(obraId: string) {
  revalidatePath(`/obras/${obraId}`);
  revalidatePath("/carteira");
  revalidatePath("/inicio");
}

export async function guardarObra(obraId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: obra } = await supabase.from("obras").select("id").eq("id", obraId).eq("ativo", true).maybeSingle();
  if (!obra) return;

  const { data: guardada } = await supabase
    .from("carteira_obras")
    .upsert(
      { user_id: user.id, obra_id: obraId, estado: "semente" },
      { onConflict: "user_id,obra_id", ignoreDuplicates: true }
    )
    .select("id");

  // Só registra o evento se a obra entrou de fato (não estava guardada).
  if (guardada?.length) {
    await supabase.from("registro_eventos").insert({ user_id: user.id, tipo: "obra_guardada", obra_id: obraId });
  }

  revalidar(obraId);
}

export async function removerObra(obraId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: removida } = await supabase
    .from("carteira_obras")
    .delete()
    .eq("user_id", user.id)
    .eq("obra_id", obraId)
    .select("id");

  if (removida?.length) {
    await supabase.from("registro_eventos").insert({ user_id: user.id, tipo: "obra_removida", obra_id: obraId });
  }

  revalidar(obraId);
}
