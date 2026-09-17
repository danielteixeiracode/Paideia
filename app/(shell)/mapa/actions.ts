"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { StatusEtapaTrilho } from "@/lib/trilhos";

export async function definirStatusEtapaTrilho(
  trilhoId: string,
  etapaId: string,
  status: StatusEtapaTrilho
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("progresso_trilho_etapa").upsert(
    { user_id: user.id, trilho_id: trilhoId, etapa_id: etapaId, status },
    { onConflict: "user_id,etapa_id" }
  );

  revalidatePath("/mapa");
}
