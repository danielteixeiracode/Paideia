"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function definirFoco(etapaId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("progresso_trilha").update({ foco_atual: false }).eq("user_id", user.id);

  const { data: existente } = await supabase
    .from("progresso_trilha")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("etapa_id", etapaId)
    .maybeSingle();

  if (existente) {
    await supabase
      .from("progresso_trilha")
      .update({
        foco_atual: true,
        status: existente.status === "bloqueada" ? "em_andamento" : existente.status,
      })
      .eq("id", existente.id);
  } else {
    await supabase.from("progresso_trilha").insert({
      user_id: user.id,
      etapa_id: etapaId,
      status: "em_andamento",
      foco_atual: true,
      data_inicio: new Date().toISOString().slice(0, 10),
    });
  }

  revalidatePath("/trilha");
  revalidatePath("/inicio");
  revalidatePath("/mapa");
}
