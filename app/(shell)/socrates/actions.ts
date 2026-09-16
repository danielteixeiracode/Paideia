"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ModoSocrates } from "@/types/database";

export async function criarConversa(modo: ModoSocrates = "maieutico") {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data } = await supabase
    .from("conversas_socrates")
    .insert({ user_id: user.id, modo, titulo: "Novo diálogo" })
    .select("id")
    .single();

  revalidatePath("/socrates");
  if (data) redirect(`/socrates?c=${data.id}`);
}
