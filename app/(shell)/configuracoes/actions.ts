"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function atualizarPerfil(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const nome = String(formData.get("nome") ?? "").trim();
  const meta_diaria_min = Number(formData.get("meta_diaria_min") ?? 60);
  const meta_semanal_horas = Number(formData.get("meta_semanal_horas") ?? 14);

  await supabase
    .from("perfis")
    .update({ nome, meta_diaria_min, meta_semanal_horas })
    .eq("id", user.id);

  revalidatePath("/configuracoes");
  revalidatePath("/inicio");
}
