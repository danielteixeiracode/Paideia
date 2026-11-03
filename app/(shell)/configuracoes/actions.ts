"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ResultadoAcao } from "@/lib/acoes";

export async function atualizarPerfil(formData: FormData): Promise<ResultadoAcao> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: "Sua sessão terminou. Entre de novo para salvar." };

  const nome = String(formData.get("nome") ?? "").trim();
  const meta_diaria_min = Number(formData.get("meta_diaria_min") ?? 60);
  const meta_semanal_horas = Number(formData.get("meta_semanal_horas") ?? 14);
  if (!nome) return { ok: false, erro: "O nome não pode ficar vazio." };

  const { error } = await supabase
    .from("perfis")
    .update({ nome, meta_diaria_min, meta_semanal_horas })
    .eq("id", user.id);
  if (error) return { ok: false, erro: "Não foi possível salvar as alterações. Tente de novo." };

  revalidatePath("/configuracoes");
  revalidatePath("/inicio");
  return { ok: true };
}
