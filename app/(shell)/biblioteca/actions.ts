"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toISODate } from "@/lib/utils";

export async function adicionarAtivoCarteira(ativoId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("carteira_itens").upsert(
    {
      user_id: user.id,
      ativo_id: ativoId,
      status: "planejado",
      data_inicio: toISODate(new Date()),
    },
    { onConflict: "user_id,ativo_id", ignoreDuplicates: true }
  );

  revalidatePath("/biblioteca");
  revalidatePath("/carteira");
  revalidatePath("/inicio");
}
