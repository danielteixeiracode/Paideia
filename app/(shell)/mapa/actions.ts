"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function alternarCapacidade(capacidadeEtapaId: string, dominada: boolean) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("progresso_capacidade").upsert(
    {
      user_id: user.id,
      capacidade_etapa_id: capacidadeEtapaId,
      dominada,
      data_dominio: dominada ? new Date().toISOString().slice(0, 10) : null,
    },
    { onConflict: "user_id,capacidade_etapa_id" }
  );

  revalidatePath("/mapa");
  revalidatePath("/inicio");
}
